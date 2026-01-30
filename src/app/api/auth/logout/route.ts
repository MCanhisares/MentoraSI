import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SESSION_COOKIE_NAME = "alumni_session";

export async function POST(request: NextRequest) {
  // Sign out from Supabase Auth
  const supabase = await createClient();
  await supabase.auth.signOut();

  const response = NextResponse.redirect(new URL("/", request.url));

  // Clear the old session cookie (for backwards compatibility)
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
