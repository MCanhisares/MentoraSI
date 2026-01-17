import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTokensFromCode, getUserInfo } from "@/lib/google";

interface AlumniRecord {
  id: string;
}

interface InviteTokenRecord {
  id: string;
  token: string;
  used_by: string | null;
  used_at: string | null;
  expires_at: string | null;
}

const SESSION_COOKIE_NAME = "alumni_session";

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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");
  const baseUrl = getBaseUrl(request);

  console.log("OAuth callback - baseUrl:", baseUrl);
  console.log("OAuth callback - request.url:", request.url);

  if (error) {
    return NextResponse.redirect(new URL("/alumni/login?error=access_denied", baseUrl));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/alumni/login?error=no_code", baseUrl));
  }

  // Parse invite token from state if present
  let inviteToken: string | null = null;
  if (state) {
    try {
      const stateData = JSON.parse(Buffer.from(state, "base64").toString());
      inviteToken = stateData.invite_token || null;
    } catch {
      console.log("OAuth callback - could not parse state");
    }
  }

  try {
    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);
    console.log("OAuth callback - tokens received, has refresh_token:", !!tokens.refresh_token);

    if (!tokens.access_token) {
      throw new Error("No access token received");
    }

    // Get user info from Google
    const userInfo = await getUserInfo(tokens.access_token);
    console.log("OAuth callback - user email:", userInfo.email);

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
      // Update existing alumni with new tokens - no invite token needed for existing users
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
      console.log("OAuth callback - updated existing alumni:", alumniId);
    } else {
      // New user - validate invite token is required
      if (!inviteToken) {
        console.log("OAuth callback - new user without invite token");
        return NextResponse.redirect(new URL("/alumni/login?error=invite_required&needs_invite=true", baseUrl));
      }

      // Validate the invite token
      const { data: tokenRecord } = await supabase
        .from("invite_tokens")
        .select("*")
        .eq("token", inviteToken)
        .single() as { data: InviteTokenRecord | null };

      if (!tokenRecord) {
        console.log("OAuth callback - invalid invite token");
        return NextResponse.redirect(new URL("/alumni/login?error=invalid_invite&needs_invite=true", baseUrl));
      }

      // Check if token is already used
      if (tokenRecord.used_by) {
        console.log("OAuth callback - invite token already used");
        return NextResponse.redirect(new URL("/alumni/login?error=invalid_invite&needs_invite=true", baseUrl));
      }

      // Check if token is expired
      if (tokenRecord.expires_at && new Date(tokenRecord.expires_at) < new Date()) {
        console.log("OAuth callback - invite token expired");
        return NextResponse.redirect(new URL("/alumni/login?error=invalid_invite&needs_invite=true", baseUrl));
      }

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

      // Mark the invite token as used
      await supabase
        .from("invite_tokens")
        .update({
          used_by: newId,
          used_at: new Date().toISOString(),
        })
        .eq("id", tokenRecord.id);

      alumniId = newId;
      console.log("OAuth callback - created new alumni with invite token:", alumniId);
    }

    // Create redirect response with session cookie
    const redirectUrl = new URL("/alumni/dashboard", baseUrl);
    console.log("OAuth callback - redirecting to:", redirectUrl.toString());

    // Build the Set-Cookie header manually for better compatibility
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    const cookieValue = `${SESSION_COOKIE_NAME}=${alumniId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

    console.log("OAuth callback - setting cookie header");

    // Use Response with explicit headers for better Vercel compatibility
    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl.toString(),
        "Set-Cookie": cookieValue,
      },
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/alumni/login?error=auth_failed", baseUrl));
  }
}
