import { google } from "googleapis";

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export function getAuthUrl() {
  const oauth2Client = getOAuth2Client();

  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
}

export async function getTokensFromCode(code: string) {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function getUserInfo(accessToken: string) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();

  return {
    email: data.email!,
    name: data.name || data.email!,
  };
}

export async function createCalendarEvent(
  refreshToken: string,
  eventDetails: {
    summary: string;
    description: string;
    startDateTime: string;
    endDateTime: string;
    attendeeEmail: string;
    timeZone?: string;
  }
) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  // Force a token refresh to ensure we have a valid access token
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
  } catch (refreshError) {
    console.error("Failed to refresh access token:", refreshError);
    throw new Error("Failed to refresh Google access token. The user may need to re-authenticate.");
  }

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // Use America/Sao_Paulo as default timezone for Brazil
  const timeZone = eventDetails.timeZone || "America/Sao_Paulo";

  const event = {
    summary: eventDetails.summary,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startDateTime,
      timeZone: timeZone,
    },
    end: {
      dateTime: eventDetails.endDateTime,
      timeZone: timeZone,
    },
    attendees: [{ email: eventDetails.attendeeEmail }],
    conferenceData: {
      createRequest: {
        requestId: `mentormatch-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  console.log("Creating calendar event with:", JSON.stringify(event, null, 2));

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
    conferenceDataVersion: 1,
    sendUpdates: "all",
  });

  console.log("Calendar event created:", response.data.id);

  return {
    eventId: response.data.id,
    meetingLink: response.data.hangoutLink,
  };
}
