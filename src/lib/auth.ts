import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const SESSION_COOKIE_NAME = "alumni_session";

export async function createSession(alumniId: string) {
  const cookieStore = await cookies();

  // Set a secure cookie with the alumni ID
  cookieStore.set(SESSION_COOKIE_NAME, alumniId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value || null;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentAlumni() {
  const alumniId = await getSession();

  if (!alumniId) {
    return null;
  }

  const supabase = await createClient();

  const { data: alumni } = await supabase
    .from("alumni")
    .select("*")
    .eq("id", alumniId)
    .single();

  return alumni;
}
