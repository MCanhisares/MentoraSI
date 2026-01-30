import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { invite_token } = await request.json();

    // Use the helper - it already handles cookies correctly
    const supabase = await createClient();

    // Get the origin for the redirect URL
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    // Build callback URL with invite token as query param if provided
    let redirectTo = `${origin}/api/auth/supabase/callback`;
    if (invite_token) {
      redirectTo += `?invite_token=${encodeURIComponent(invite_token)}`;
    }

    // Initiate OAuth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("OAuth initiation error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Return the OAuth URL for the client to redirect to
    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to initiate login" },
      { status: 500 }
    );
  }
}
