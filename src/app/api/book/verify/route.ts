import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCalendarEvent } from "@/lib/google";
import {
  sendBookingConfirmationToStudent,
  sendBookingNotificationToAlumni,
} from "@/lib/email";
import { format, parseISO } from "date-fns";

interface SessionRow {
  id: string;
  slot_id: string;
  alumni_id: string;
  student_email: string;
  student_name: string | null;
  student_linkedin: string | null;
  student_notes: string | null;
  session_date: string;
  start_time: string;
  end_time: string;
  management_token: string | null;
  verification_token: string | null;
  status: string;
}

interface AlumniRow {
  id: string;
  email: string;
  name: string;
  google_refresh_token: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token de verificação não fornecido" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Find session by verification token
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("*")
      .eq("verification_token", token)
      .single() as { data: SessionRow | null; error: unknown };

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Token de verificação inválido ou expirado" },
        { status: 404 }
      );
    }

    // Check if already verified
    if (session.status === "confirmed") {
      return NextResponse.json({
        success: true,
        already_verified: true,
        session: {
          id: session.id,
          date: session.session_date,
          start_time: session.start_time,
          end_time: session.end_time,
        },
      });
    }

    // Check if cancelled
    if (session.status === "cancelled") {
      return NextResponse.json(
        { error: "Esta sessão foi cancelada" },
        { status: 400 }
      );
    }

    // Get alumni info for calendar event
    const { data: alumni } = await supabase
      .from("alumni")
      .select("*")
      .eq("id", session.alumni_id)
      .single() as { data: AlumniRow | null };

    if (!alumni) {
      return NextResponse.json(
        { error: "Mentor não encontrado" },
        { status: 404 }
      );
    }

    // Get base URL for management links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      (request.headers.get("host")?.includes("localhost")
        ? `http://${request.headers.get("host")}`
        : `https://${request.headers.get("host")}`);

    const rescheduleLink = `${baseUrl}/session/${session.id}/reschedule?token=${session.management_token}`;
    const cancelLink = `${baseUrl}/session/${session.id}/cancel?token=${session.management_token}`;

    let googleEventId: string | null = null;
    let meetingLink: string | null = null;

    // Create Google Calendar event if alumni has connected their calendar
    if (alumni.google_refresh_token) {
      try {
        const description = [
          `Sessão de mentoria com ${session.student_name}`,
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

        const calendarResult = await createCalendarEvent(
          alumni.google_refresh_token,
          {
            summary: `MentoraSI - Mentoria com ${session.student_name}`,
            description,
            startDateTime: `${session.session_date}T${session.start_time}`,
            endDateTime: `${session.session_date}T${session.end_time}`,
            attendeeEmail: session.student_email,
          }
        );

        googleEventId = calendarResult.eventId || null;
        meetingLink = calendarResult.meetingLink || null;
        console.log("Calendar event created successfully:", { googleEventId, meetingLink });
      } catch (calendarError) {
        console.error("Failed to create calendar event:", calendarError);
        // Continue without calendar event - not a critical failure
      }
    }

    // Update session: confirm status, clear verification token, add calendar info
    const { error: updateError } = await supabase
      .from("sessions")
      .update({
        status: "confirmed",
        verification_token: null,
        google_event_id: googleEventId,
        meeting_link: meetingLink,
      })
      .eq("id", session.id);

    if (updateError) {
      console.error("Failed to update session:", updateError);
      return NextResponse.json(
        { error: "Falha ao confirmar sessão" },
        { status: 500 }
      );
    }

    // Send confirmation emails
    const formattedDate = format(parseISO(session.session_date), "EEEE, MMMM d, yyyy");

    // try {
    //   await sendBookingConfirmationToStudent(session.student_email, {
    //     studentName: session.student_name || "Estudante",
    //     date: formattedDate,
    //     startTime: session.start_time.slice(0, 5),
    //     endTime: session.end_time.slice(0, 5),
    //     meetingLink,
    //     sessionId: session.id,
    //     managementToken: session.management_token || "",
    //     baseUrl,
    //   });
    //   console.log("Student confirmation email sent successfully");
    // } catch (emailError) {
    //   console.error("Failed to send student confirmation email:", emailError);
    // }

    try {
      await sendBookingNotificationToAlumni(alumni.email, {
        date: formattedDate,
        startTime: session.start_time.slice(0, 5),
        endTime: session.end_time.slice(0, 5),
        studentEmail: session.student_email,
        studentName: session.student_name || "Estudante",
        studentLinkedin: session.student_linkedin,
        studentNotes: session.student_notes,
        meetingLink,
        sessionId: session.id,
        managementToken: session.management_token || "",
        baseUrl,
      });
      console.log("Alumni notification email sent successfully");
    } catch (emailError) {
      console.error("Failed to send alumni notification email:", emailError);
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        date: session.session_date,
        start_time: session.start_time,
        end_time: session.end_time,
        meeting_link: meetingLink,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro inesperado" },
      { status: 500 }
    );
  }
}
