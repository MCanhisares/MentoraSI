import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface SessionWithAlumni {
  id: string;
  student_email: string;
  student_name: string | null;
  session_date: string;
  start_time: string;
  end_time: string;
  status: string;
  management_token: string | null;
  alumni: {
    id: string;
    name: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 401 }
      );
    }

    // Use admin client to bypass RLS for token-based access
    const supabase = createAdminClient();

    const { data: session, error } = await supabase
      .from("sessions")
      .select(`
        id,
        student_email,
        student_name,
        session_date,
        start_time,
        end_time,
        status,
        management_token,
        alumni:alumni_id (
          id,
          name
        )
      `)
      .eq("id", id)
      .single() as { data: SessionWithAlumni | null; error: unknown };

    if (error || !session) {
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

    // Don't expose the management token in the response
    const { management_token: _, ...sessionData } = session;

    return NextResponse.json({ session: sessionData });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
