import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateCalendarEvent } from "@/lib/google";
import { sendRescheduleNotification } from "@/lib/email";
import { format, parseISO } from "date-fns";

interface SessionRow {
  id: string;
  slot_id: string;
  student_email: string;
  student_name: string | null;
  student_linkedin: string | null;
  student_notes: string | null;
  session_date: string;
  start_time: string;
  end_time: string;
  google_event_id: string | null;
  meeting_link: string | null;
  management_token: string | null;
  status: string;
  alumni_id: string;
}

interface AlumniRow {
  id: string;
  email: string;
  name: string;
  google_refresh_token: string | null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { token, new_date, new_start_time, new_end_time, new_slot_id } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 401 }
      );
    }

    if (!new_date || !new_start_time || !new_end_time || !new_slot_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch the original session
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", id)
      .single() as { data: SessionRow | null; error: unknown };

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Validate token
    if (session.management_token !== token) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 403 }
      );
    }

    // Check if already cancelled
    if (session.status === "cancelled") {
      return NextResponse.json(
        { error: "Cannot reschedule a cancelled session" },
        { status: 400 }
      );
    }

    // Get alumni info
    const { data: alumni } = await supabase
      .from("alumni")
      .select("*")
      .eq("id", session.alumni_id)
      .single() as { data: AlumniRow | null };

    if (!alumni) {
      return NextResponse.json(
        { error: "Alumni not found" },
        { status: 404 }
      );
    }

    // Check if new slot is already booked (by a different session)
    const { data: existingSession } = await supabase
      .from("sessions")
      .select("id")
      .eq("alumni_id", session.alumni_id)
      .eq("session_date", new_date)
      .eq("start_time", new_start_time)
      .in("status", ["pending", "confirmed"])
      .neq("id", id)
      .single();

    if (existingSession) {
      return NextResponse.json(
        { error: "This time slot has already been booked" },
        { status: 409 }
      );
    }

    // Get base URL for management links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      (request.headers.get("host")?.includes("localhost")
        ? `http://${request.headers.get("host")}`
        : `https://${request.headers.get("host")}`);

    const rescheduleLink = `${baseUrl}/sessao/${session.id}/reagendar?token=${session.management_token}`;
    const cancelLink = `${baseUrl}/sessao/${session.id}/cancelar?token=${session.management_token}`;

    // Update the existing Google Calendar event (instead of delete+create)
    let meetingLink = session.meeting_link;

    if (session.google_event_id && alumni.google_refresh_token) {
      try {
        const formattedStartTime = new_start_time.length === 5 ? `${new_start_time}:00` : new_start_time;
        const formattedEndTime = new_end_time.length === 5 ? `${new_end_time}:00` : new_end_time;

        const description = [
          `Sessão de mentoria com ${session.student_name || "Estudante"}`,
          ``,
          `E-mail: ${session.student_email}`,
          session.student_linkedin ? `LinkedIn: ${session.student_linkedin}` : null,
          session.student_notes ? `\nNotas do estudante:\n${session.student_notes}` : null,
          ``,
          `─────────────────────────`,
          `Gerenciar sessão:`,
          `• Reagendar: ${rescheduleLink}`,
          `• Cancelar: ${cancelLink}`,
        ].filter(Boolean).join("\n");

        const calendarResult = await updateCalendarEvent(
          alumni.google_refresh_token,
          session.google_event_id,
          {
            summary: `MentoraSI - Mentoria com ${session.student_name || "Estudante"}`,
            description,
            startDateTime: `${new_date}T${formattedStartTime}`,
            endDateTime: `${new_date}T${formattedEndTime}`,
          }
        );

        // Keep existing meeting link (Google Meet link stays the same when updating)
        meetingLink = calendarResult.meetingLink || session.meeting_link;
        console.log("Calendar event updated successfully");
      } catch (calendarError) {
        console.error("Failed to update calendar event:", calendarError);
        // Continue anyway - the session will still be rescheduled in our database
      }
    }

    // Store old values for notification
    const oldDate = session.session_date;
    const oldStartTime = session.start_time;
    const oldEndTime = session.end_time;

    // Update the existing session (same ID, same management token)
    const { error: updateError } = await supabase
      .from("sessions")
      .update({
        slot_id: new_slot_id,
        session_date: new_date,
        start_time: new_start_time,
        end_time: new_end_time,
        meeting_link: meetingLink,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Failed to update session:", updateError);
      return NextResponse.json(
        { error: "Failed to reschedule session" },
        { status: 500 }
      );
    }

    // Send reschedule notifications
    const oldFormattedDate = format(parseISO(oldDate), "EEEE, MMMM d, yyyy");
    const newFormattedDate = format(parseISO(new_date), "EEEE, MMMM d, yyyy");
    const studentName = session.student_name || "Estudante";

    // Send to student (with management links)
    try {
      await sendRescheduleNotification(session.student_email, {
        recipientName: studentName,
        studentName,
        oldDate: oldFormattedDate,
        oldStartTime: oldStartTime.slice(0, 5),
        oldEndTime: oldEndTime.slice(0, 5),
        newDate: newFormattedDate,
        newStartTime: new_start_time.slice(0, 5),
        newEndTime: new_end_time.slice(0, 5),
        meetingLink,
        rescheduleLink,
        cancelLink,
      });
    } catch (emailError) {
      console.error("Failed to send student reschedule email:", emailError);
    }

    // Send to alumni (with cancel link only)
    try {
      await sendRescheduleNotification(alumni.email, {
        recipientName: alumni.name,
        studentName,
        oldDate: oldFormattedDate,
        oldStartTime: oldStartTime.slice(0, 5),
        oldEndTime: oldEndTime.slice(0, 5),
        newDate: newFormattedDate,
        newStartTime: new_start_time.slice(0, 5),
        newEndTime: new_end_time.slice(0, 5),
        meetingLink,
        cancelLink,
      });
    } catch (emailError) {
      console.error("Failed to send alumni reschedule email:", emailError);
    }

    return NextResponse.json({
      success: true,
      session_id: session.id,
      meeting_link: meetingLink,
    });
  } catch (error) {
    console.error("Reschedule error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
