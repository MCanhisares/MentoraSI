import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCalendarEvent } from "@/lib/google";
import {
  sendBookingConfirmationToStudent,
  sendBookingNotificationToAlumni,
} from "@/lib/email";
import { format, parseISO, getDay } from "date-fns";
import { randomUUID } from "crypto";

interface AlumniRow {
  id: string;
  email: string;
  name: string;
  google_refresh_token: string | null;
}

interface SessionRow {
  id: string;
  management_token: string | null;
}

interface AvailabilitySlotRow {
  id: string;
  alumni_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  specific_date: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      booking_key,
      date,
      start_time,
      end_time,
      student_email,
      student_name,
      student_linkedin,
      student_notes,
    } = body;

    if (!booking_key || !date || !start_time || !end_time || !student_email || !student_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Decode booking key - now contains date/time info instead of specific alumni
    let bookingInfo: { date: string; start_time: string; end_time: string };
    try {
      bookingInfo = JSON.parse(Buffer.from(booking_key, "base64").toString());
    } catch {
      return NextResponse.json(
        { error: "Invalid booking key" },
        { status: 400 }
      );
    }

    // Verify the booking key matches the provided date/time
    if (bookingInfo.date !== date || bookingInfo.start_time !== start_time) {
      return NextResponse.json(
        { error: "Booking key mismatch" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Normalize time for comparison
    const normalizedStartTime = start_time.length === 5 ? `${start_time}:00` : start_time;
    const normalizedEndTime = end_time.length === 5 ? `${end_time}:00` : end_time;

    // Get the day of week for the requested date
    const requestedDate = parseISO(date);
    const dayOfWeek = getDay(requestedDate);

    // Find all availability slots that cover this time
    // Check both recurring slots for this day of week and specific date slots
    const { data: availabilitySlots } = await supabase
      .from("availability_slots")
      .select("id, alumni_id, day_of_week, start_time, end_time, is_recurring, specific_date")
      .or(`and(is_recurring.eq.true,day_of_week.eq.${dayOfWeek}),and(is_recurring.eq.false,specific_date.eq.${date})`) as { data: AvailabilitySlotRow[] | null };

    if (!availabilitySlots || availabilitySlots.length === 0) {
      return NextResponse.json(
        { error: "No availability found for this time" },
        { status: 404 }
      );
    }

    // Filter slots that actually cover the requested time
    const matchingSlots = availabilitySlots.filter((slot) => {
      const slotStart = slot.start_time.length === 5 ? `${slot.start_time}:00` : slot.start_time;
      const slotEnd = slot.end_time.length === 5 ? `${slot.end_time}:00` : slot.end_time;

      // Check if the requested time falls within this slot
      return slotStart <= normalizedStartTime && slotEnd >= normalizedEndTime;
    });

    if (matchingSlots.length === 0) {
      return NextResponse.json(
        { error: "No availability found for this time" },
        { status: 404 }
      );
    }

    // Get all alumni IDs from matching slots
    const alumniIds = [...new Set(matchingSlots.map((s) => s.alumni_id))];

    // Check which alumni are already booked for this time
    const { data: bookedSessions } = await supabase
      .from("sessions")
      .select("alumni_id")
      .eq("session_date", date)
      .eq("start_time", normalizedStartTime)
      .in("status", ["pending", "confirmed"])
      .in("alumni_id", alumniIds);

    const bookedAlumniIds = new Set(bookedSessions?.map((s) => s.alumni_id) || []);

    // Filter to only available alumni
    const availableSlots = matchingSlots.filter((slot) => !bookedAlumniIds.has(slot.alumni_id));

    if (availableSlots.length === 0) {
      return NextResponse.json(
        { error: "All mentors are booked for this time slot" },
        { status: 409 }
      );
    }

    // Pick a random available alumni (for fair distribution)
    const selectedSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];

    // Get alumni info for calendar event
    const { data: alumni } = await supabase
      .from("alumni")
      .select("*")
      .eq("id", selectedSlot.alumni_id)
      .single() as { data: AlumniRow | null };

    if (!alumni) {
      return NextResponse.json(
        { error: "Alumni not found" },
        { status: 404 }
      );
    }

    // Generate management token for cancel/reschedule links
    const managementToken = randomUUID();

    // Create the session record FIRST (without calendar info)
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        slot_id: selectedSlot.id,
        alumni_id: selectedSlot.alumni_id,
        student_email,
        student_name,
        student_linkedin: student_linkedin || null,
        student_notes: student_notes || null,
        session_date: date,
        start_time: normalizedStartTime,
        end_time: normalizedEndTime,
        management_token: managementToken,
        status: "confirmed",
      } as Record<string, unknown>)
      .select()
      .single() as { data: SessionRow | null; error: unknown };

    if (sessionError) {
      console.error("Failed to create session:", sessionError);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    // Get base URL for management links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      (request.headers.get("host")?.includes("localhost")
        ? `http://${request.headers.get("host")}`
        : `https://${request.headers.get("host")}`);

    const rescheduleLink = `${baseUrl}/session/${session?.id}/reschedule?token=${managementToken}`;
    const cancelLink = `${baseUrl}/session/${session?.id}/cancel?token=${managementToken}`;

    let googleEventId: string | null = null;
    let meetingLink: string | null = null;

    // Create Google Calendar event if alumni has connected their calendar
    if (alumni.google_refresh_token) {
      try {
        const description = [
          `Sessão de mentoria com ${student_name}`,
          ``,
          `E-mail: ${student_email}`,
          student_linkedin ? `LinkedIn: ${student_linkedin}` : null,
          student_notes ? `\nNotas do estudante:\n${student_notes}` : null,
          ``,
          `─────────────────────────`,
          `Gerenciar sessão:`,
          `• Reagendar: ${rescheduleLink}`,
          `• Cancelar: ${cancelLink}`,
        ].filter(Boolean).join("\n");

        const calendarResult = await createCalendarEvent(
          alumni.google_refresh_token,
          {
            summary: `MentoraSI - Mentoria com ${student_name}`,
            description,
            startDateTime: `${date}T${normalizedStartTime}`,
            endDateTime: `${date}T${normalizedEndTime}`,
            attendeeEmail: student_email,
          }
        );

        googleEventId = calendarResult.eventId || null;
        meetingLink = calendarResult.meetingLink || null;
        console.log("Calendar event created successfully:", { googleEventId, meetingLink });

        // Update session with calendar info
        await supabase
          .from("sessions")
          .update({
            google_event_id: googleEventId,
            meeting_link: meetingLink,
          })
          .eq("id", session?.id);

      } catch (calendarError) {
        console.error("Failed to create calendar event:", calendarError);
        if (calendarError instanceof Error) {
          console.error("Error message:", calendarError.message);
          console.error("Error stack:", calendarError.stack);
        }
        // Continue without calendar event - not a critical failure
      }
    } else {
      console.log("Alumni does not have a refresh token, skipping calendar event creation");
    }

    // Send email notifications
    const formattedDate = format(parseISO(date), "EEEE, MMMM d, yyyy");

    try {
      await sendBookingConfirmationToStudent(student_email, {
        studentName: student_name,
        date: formattedDate,
        startTime: normalizedStartTime.slice(0, 5),
        endTime: normalizedEndTime.slice(0, 5),
        meetingLink,
        sessionId: session?.id || "",
        managementToken: managementToken,
        baseUrl,
      });
      console.log("Student confirmation email sent successfully");
    } catch (emailError) {
      console.error("Failed to send student email:", emailError);
    }

    try {
      await sendBookingNotificationToAlumni(alumni.email, {
        date: formattedDate,
        startTime: normalizedStartTime.slice(0, 5),
        endTime: normalizedEndTime.slice(0, 5),
        studentEmail: student_email,
        studentName: student_name,
        studentLinkedin: student_linkedin || null,
        studentNotes: student_notes || null,
        meetingLink,
        sessionId: session?.id || "",
        managementToken,
        baseUrl,
      });
      console.log("Alumni notification email sent successfully");
    } catch (emailError) {
      console.error("Failed to send alumni email:", emailError);
    }

    return NextResponse.json({
      success: true,
      session_id: session?.id,
      meeting_link: meetingLink,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
