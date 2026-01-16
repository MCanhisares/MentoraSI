import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCalendarEvent } from "@/lib/google";
import {
  sendBookingConfirmationToStudent,
  sendBookingNotificationToAlumni,
} from "@/lib/email";
import { format, parseISO } from "date-fns";

interface AlumniRow {
  id: string;
  email: string;
  name: string;
  google_refresh_token: string | null;
}

interface SessionRow {
  id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { booking_key, date, start_time, end_time, student_email } = body;

    if (!booking_key || !date || !start_time || !end_time || !student_email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Decode booking key
    let slotInfo: { slot_id: string; alumni_id: string };
    try {
      slotInfo = JSON.parse(Buffer.from(booking_key, "base64").toString());
    } catch {
      return NextResponse.json(
        { error: "Invalid booking key" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify the slot still exists and is valid
    const { data: slot } = await supabase
      .from("availability_slots")
      .select("*")
      .eq("id", slotInfo.slot_id)
      .single();

    if (!slot) {
      return NextResponse.json(
        { error: "Slot no longer available" },
        { status: 404 }
      );
    }

    // Check if this specific date/time is already booked
    const { data: existingSession } = await supabase
      .from("sessions")
      .select("id")
      .eq("alumni_id", slotInfo.alumni_id)
      .eq("session_date", date)
      .eq("start_time", start_time)
      .in("status", ["pending", "confirmed"])
      .single();

    if (existingSession) {
      return NextResponse.json(
        { error: "This time slot has already been booked" },
        { status: 409 }
      );
    }

    // Get alumni info for calendar event
    const { data: alumni } = await supabase
      .from("alumni")
      .select("*")
      .eq("id", slotInfo.alumni_id)
      .single() as { data: AlumniRow | null };

    if (!alumni) {
      return NextResponse.json(
        { error: "Alumni not found" },
        { status: 404 }
      );
    }

    let googleEventId: string | null = null;
    let meetingLink: string | null = null;

    // Create Google Calendar event if alumni has connected their calendar
    if (alumni.google_refresh_token) {
      try {
        const startDateTime = `${date}T${start_time}:00`;
        const endDateTime = `${date}T${end_time}:00`;

        const calendarResult = await createCalendarEvent(
          alumni.google_refresh_token,
          {
            summary: "MentorMatch - Mentoring Session",
            description: `Anonymous mentoring session with a student.\n\nStudent email: ${student_email}`,
            startDateTime,
            endDateTime,
            attendeeEmail: student_email,
          }
        );

        googleEventId = calendarResult.eventId || null;
        meetingLink = calendarResult.meetingLink || null;
      } catch (calendarError) {
        console.error("Failed to create calendar event:", calendarError);
        // Continue without calendar event - not a critical failure
      }
    }

    // Create the session record
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        slot_id: slotInfo.slot_id,
        alumni_id: slotInfo.alumni_id,
        student_email,
        session_date: date,
        start_time,
        end_time,
        google_event_id: googleEventId,
        meeting_link: meetingLink,
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

    // Send email notifications
    const formattedDate = format(parseISO(date), "EEEE, MMMM d, yyyy");

    try {
      await sendBookingConfirmationToStudent(student_email, {
        date: formattedDate,
        startTime: start_time.slice(0, 5),
        endTime: end_time.slice(0, 5),
        meetingLink,
      });
    } catch (emailError) {
      console.error("Failed to send student email:", emailError);
    }

    try {
      await sendBookingNotificationToAlumni(alumni.email, {
        date: formattedDate,
        startTime: start_time.slice(0, 5),
        endTime: end_time.slice(0, 5),
        studentEmail: student_email,
        meetingLink,
      });
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
