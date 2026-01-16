import { Resend } from "resend";

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured - emails will not be sent");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendBookingConfirmationToStudent(
  studentEmail: string,
  sessionDetails: {
    date: string;
    startTime: string;
    endTime: string;
    meetingLink: string | null;
  }
) {
  const resend = getResendClient();
  if (!resend) return;

  const { date, startTime, endTime, meetingLink } = sessionDetails;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "MentorMatch <noreply@mentormatch.com>",
    to: studentEmail,
    subject: "Your Mentoring Session is Confirmed",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Session Confirmed!</h1>
        <p>Your mentoring session has been booked successfully.</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
          ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ""}
        </div>

        <p>You will meet with an alumni mentor. The mentor's identity will be revealed during the session.</p>

        <p style="color: #6b7280; font-size: 14px;">
          If you need to cancel, please contact us as soon as possible.
        </p>
      </div>
    `,
  });
}

export async function sendBookingNotificationToAlumni(
  alumniEmail: string,
  sessionDetails: {
    date: string;
    startTime: string;
    endTime: string;
    studentEmail: string;
    meetingLink: string | null;
  }
) {
  const resend = getResendClient();
  if (!resend) return;

  const { date, startTime, endTime, studentEmail, meetingLink } = sessionDetails;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "MentorMatch <noreply@mentormatch.com>",
    to: alumniEmail,
    subject: "New Mentoring Session Booked",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">New Session Booked!</h1>
        <p>A student has booked a mentoring session with you.</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
          <p><strong>Student Email:</strong> ${studentEmail}</p>
          ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ""}
        </div>

        <p>A calendar event has been created automatically. Please check your Google Calendar.</p>

        <p style="color: #6b7280; font-size: 14px;">
          Thank you for being a mentor!
        </p>
      </div>
    `,
  });
}
