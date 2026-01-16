import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTokensFromCode, getUserInfo } from "@/lib/google";

interface AlumniRecord {
  id: string;
}

const SESSION_COOKIE_NAME = "alumni_session";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL("/alumni/login?error=access_denied", request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/alumni/login?error=no_code", request.url)
    );
  }

  try {
    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    if (!tokens.access_token) {
      throw new Error("No access token received");
    }

    // Get user info from Google
    const userInfo = await getUserInfo(tokens.access_token);

    // Get Supabase client
    const supabase = await createClient();

    // Check if alumni exists
    const { data: existingAlumni } = await supabase
      .from("alumni")
      .select("id")
      .eq("email", userInfo.email)
      .single() as { data: AlumniRecord | null };

    let alumniId: string;

    if (existingAlumni) {
      // Update existing alumni with new tokens
      // Only update refresh_token if a new one was provided (Google only sends it on first auth)
      const updateData: Record<string, unknown> = {
        google_access_token: tokens.access_token,
        name: userInfo.name,
      };

      // Only update refresh token if Google provided a new one
      if (tokens.refresh_token) {
        updateData.google_refresh_token = tokens.refresh_token;
      }

      await supabase
        .from("alumni")
        .update(updateData)
        .eq("id", existingAlumni.id);

      alumniId = existingAlumni.id;
    } else {
      // Create new alumni with a generated UUID
      const newId = crypto.randomUUID();

      const { error: insertError } = await supabase.from("alumni").insert({
        id: newId,
        email: userInfo.email,
        name: userInfo.name,
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token,
      } as Record<string, unknown>);

      if (insertError) {
        console.error("Failed to create alumni:", insertError);
        throw insertError;
      }

      alumniId = newId;
    }

    // Create redirect response with session cookie
    const response = NextResponse.redirect(
      new URL("/alumni/dashboard", request.url)
    );

    // Set the session cookie on the response
    response.cookies.set(SESSION_COOKIE_NAME, alumniId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/alumni/login?error=auth_failed", request.url)
    );
  }
}
