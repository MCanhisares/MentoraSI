import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTokensFromCode } from "@/lib/google";
import { getCurrentAlumni } from "@/lib/auth";

function getBaseUrl(request: NextRequest): string {
  // Use the host header to determine the base URL
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";

  if (host) {
    return `${protocol}://${host}`;
  }

  // Fallback to request.url
  const url = new URL(request.url);
  return url.origin;
}

// This callback is for Google Calendar OAuth ONLY (not authentication)
// User must already be logged in via Supabase Auth
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const baseUrl = getBaseUrl(request);

  console.log("Calendar OAuth callback - baseUrl:", baseUrl);

  if (error) {
    return NextResponse.redirect(
      new URL("/alumni/dashboard?calendar_error=access_denied", baseUrl)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/alumni/dashboard?calendar_error=no_code", baseUrl)
    );
  }

  try {
    // Verify user is authenticated
    const alumni = await getCurrentAlumni();

    if (!alumni) {
      return NextResponse.redirect(
        new URL("/alumni/login?error=not_authenticated", baseUrl)
      );
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);
    console.log("Calendar OAuth - tokens received, has refresh_token:", !!tokens.refresh_token);

    if (!tokens.access_token) {
      throw new Error("No access token received");
    }

    // Get Supabase client
    const supabase = await createClient();

    // Update alumni with calendar tokens
    const updateData: Record<string, unknown> = {
      google_access_token: tokens.access_token,
    };

    // Only update refresh token if Google provided a new one
    if (tokens.refresh_token) {
      updateData.google_refresh_token = tokens.refresh_token;
    }

    const { error: updateError } = await supabase
      .from("alumni")
      // @ts-expect-error - Database types not properly inferred
      .update(updateData)
      .eq("id", alumni.id);

    if (updateError) {
      console.error("Failed to update calendar tokens:", updateError);
      throw updateError;
    }

    console.log("Calendar OAuth - updated alumni calendar tokens:", alumni.id);

    // Redirect back to dashboard with success message
    return NextResponse.redirect(
      new URL("/alumni/dashboard?calendar_connected=true", baseUrl)
    );
  } catch (error) {
    console.error("Calendar OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/alumni/dashboard?calendar_error=connection_failed", baseUrl)
    );
  }
}
