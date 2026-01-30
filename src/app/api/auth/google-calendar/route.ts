import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google";
import { getCurrentAlumni } from "@/lib/auth";

// This endpoint is for connecting Google Calendar ONLY (not for authentication)
// User must already be logged in via Supabase Auth
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const alumni = await getCurrentAlumni();

    if (!alumni) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Generate OAuth URL for calendar permissions
    const authUrl = getAuthUrl();

    // Redirect to Google OAuth
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error generating calendar auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}
