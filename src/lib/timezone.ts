// Timezone utilities for MentoraSI
// Alumni times are stored in America/Sao_Paulo timezone
// We convert to user's local timezone for display

export const ALUMNI_TIMEZONE = "America/Sao_Paulo";

/**
 * Get the user's timezone from the browser
 */
export function getUserTimezone(): string {
  if (typeof window === "undefined") {
    return ALUMNI_TIMEZONE;
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Convert a date and time from alumni timezone to target timezone
 * @param date - Date in YYYY-MM-DD format
 * @param time - Time in HH:MM or HH:MM:SS format
 * @param targetTimezone - Target timezone (e.g., "America/New_York")
 * @returns Object with converted date and time
 */
export function convertFromAlumniTimezone(
  date: string,
  time: string,
  targetTimezone: string
): { date: string; time: string } {
  // If same timezone, no conversion needed
  if (targetTimezone === ALUMNI_TIMEZONE) {
    return { date, time: time.slice(0, 5) };
  }

  // Parse the date and time in alumni timezone
  const timeStr = time.length === 5 ? `${time}:00` : time;
  const dateTimeStr = `${date}T${timeStr}`;

  // Create date object treating the input as alumni timezone
  const alumniDate = new Date(
    new Date(dateTimeStr).toLocaleString("en-US", { timeZone: ALUMNI_TIMEZONE })
  );

  // Get the offset difference between timezones
  const alumniOffset = getTimezoneOffset(date, ALUMNI_TIMEZONE);
  const targetOffset = getTimezoneOffset(date, targetTimezone);
  const offsetDiff = targetOffset - alumniOffset;

  // Create UTC date from alumni timezone
  const utcDate = new Date(`${dateTimeStr}Z`);
  utcDate.setMinutes(utcDate.getMinutes() + alumniOffset);

  // Convert to target timezone
  const targetDate = new Date(utcDate.getTime() - offsetDiff * 60000);

  // Format the result
  const resultDate = targetDate.toISOString().split("T")[0];
  const resultTime = targetDate.toISOString().split("T")[1].slice(0, 5);

  return { date: resultDate, time: resultTime };
}

/**
 * Get timezone offset in minutes for a specific date and timezone
 */
function getTimezoneOffset(date: string, timezone: string): number {
  const testDate = new Date(`${date}T12:00:00Z`);

  const utcDate = new Date(testDate.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(testDate.toLocaleString("en-US", { timeZone: timezone }));

  return (utcDate.getTime() - tzDate.getTime()) / 60000;
}

/**
 * Format a date and time for display, with optional timezone conversion
 * @param date - Date in YYYY-MM-DD format
 * @param time - Time in HH:MM or HH:MM:SS format
 * @param options - Formatting options
 */
export function formatDateTime(
  date: string,
  time: string,
  options?: {
    showTimezone?: boolean;
    targetTimezone?: string;
    locale?: string;
  }
): string {
  const targetTz = options?.targetTimezone || getUserTimezone();
  const locale = options?.locale || "pt-BR";

  const converted = convertFromAlumniTimezone(date, time, targetTz);

  const dateObj = new Date(`${converted.date}T${converted.time}:00`);

  const formattedDate = dateObj.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = converted.time;

  if (options?.showTimezone && targetTz !== ALUMNI_TIMEZONE) {
    const tzAbbr = getTimezoneAbbreviation(targetTz);
    return `${formattedDate} às ${formattedTime} (${tzAbbr})`;
  }

  return `${formattedDate} às ${formattedTime}`;
}

/**
 * Get timezone abbreviation
 */
function getTimezoneAbbreviation(timezone: string): string {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    timeZoneName: "short",
  };

  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date);
  const tzPart = parts.find((part) => part.type === "timeZoneName");

  return tzPart?.value || timezone;
}

/**
 * Check if user is in a different timezone than alumni
 */
export function isUserInDifferentTimezone(): boolean {
  return getUserTimezone() !== ALUMNI_TIMEZONE;
}

/**
 * Get a user-friendly description of the timezone difference
 */
export function getTimezoneDifferenceText(): string | null {
  const userTz = getUserTimezone();
  if (userTz === ALUMNI_TIMEZONE) return null;

  const today = new Date().toISOString().split("T")[0];
  const alumniOffset = getTimezoneOffset(today, ALUMNI_TIMEZONE);
  const userOffset = getTimezoneOffset(today, userTz);

  const diffHours = (userOffset - alumniOffset) / 60;

  if (diffHours === 0) return null;

  const sign = diffHours > 0 ? "+" : "";
  return `Seu fuso horário é ${sign}${diffHours}h em relação ao horário de Brasília`;
}
