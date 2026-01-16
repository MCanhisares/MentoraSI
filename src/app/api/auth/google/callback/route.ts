import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTokensFromCode, getUserInfo } from "@/lib/google";

interface AlumniRecord {
  id: string;
}

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

    if (existingAlumni) {
      // Update existing alumni with new tokens
      await supabase
        .from("alumni")
        .update({
          google_access_token: tokens.access_token,
          google_refresh_token: tokens.refresh_token || null,
          name: userInfo.name,
        } as Record<string, unknown>)
        .eq("id", existingAlumni.id);

      // Sign in with Supabase Auth (create session)
      await supabase.auth.signInWithPassword({
        email: userInfo.email,
        password: existingAlumni.id, // Use ID as password for simplicity
      });
    } else {
      // Create new alumni
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userInfo.email,
        password: crypto.randomUUID(), // Random password - we use Google for auth
      });

      if (authError) {
        throw authError;
      }

      // Insert alumni record
      await supabase.from("alumni").insert({
        id: authData.user?.id,
        email: userInfo.email,
        name: userInfo.name,
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token,
      } as Record<string, unknown>);
    }

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/alumni/dashboard", request.url));
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/alumni/login?error=auth_failed", request.url)
    );
  }
}
