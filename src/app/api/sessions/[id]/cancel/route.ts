import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteCalendarEvent } from "@/lib/google";
import { sendCancellationNotification } from "@/lib/email";
import { format, parseISO } from "date-fns";

interface SessionRow {
  id: string;
  student_email: string;
  student_name: string | null;
  session_date: string;
  start_time: string;
  end_time: string;
  google_event_id: string | null;
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
    const { token, reason } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Fetch the session
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
        { error: "Session is already cancelled" },
        { status: 400 }
      );
    }

    // Get alumni info
    const { data: alumni } = await supabase
      .from("alumni")
      .select("*")
      .eq("id", session.alumni_id)
      .single() as { data: AlumniRow | null };

    // Delete Google Calendar event if exists
    if (session.google_event_id && alumni?.google_refresh_token) {
      try {
        await deleteCalendarEvent(alumni.google_refresh_token, session.google_event_id);
      } catch (calendarError) {
        console.error("Failed to delete calendar event:", calendarError);
        // Continue with cancellation even if calendar delete fails
      }
    }

    // Update session status
    const { error: updateError } = await supabase
      .from("sessions")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason || null,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Failed to update session:", updateError);
      return NextResponse.json(
        { error: "Failed to cancel session" },
        { status: 500 }
      );
    }

    // Send cancellation emails
    const formattedDate = format(parseISO(session.session_date), "EEEE, MMMM d, yyyy");
    const studentName = session.student_name || "Estudante";

    // Send to student
    try {
      await sendCancellationNotification(session.student_email, {
        recipientName: studentName,
        studentName,
        date: formattedDate,
        startTime: session.start_time.slice(0, 5),
        endTime: session.end_time.slice(0, 5),
        cancelledBy: "student",
        reason,
      });
    } catch (emailError) {
      console.error("Failed to send student cancellation email:", emailError);
    }

    // Send to alumni
    if (alumni) {
      try {
        await sendCancellationNotification(alumni.email, {
          recipientName: alumni.name,
          studentName,
          date: formattedDate,
          startTime: session.start_time.slice(0, 5),
          endTime: session.end_time.slice(0, 5),
          cancelledBy: "student",
          reason,
        });
      } catch (emailError) {
        console.error("Failed to send alumni cancellation email:", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancellation error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
