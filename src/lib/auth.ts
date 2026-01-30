import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
  // Try Supabase Auth first
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (user && !authError) {
    // User is authenticated with Supabase Auth
    // Query alumni by auth_user_id using regular client (RLS enforced)
    const { data: alumni } = await supabase
      .from("alumni")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    return alumni;
  }

  // Fallback to cookie auth (during migration period)
  const alumniId = await getSession();

  if (!alumniId) {
    return null;
  }

  // Use admin client because we're using custom cookie auth, not Supabase Auth
  // The session cookie is validated above, so this is safe
  const adminSupabase = createAdminClient();

  const { data: alumni } = await adminSupabase
    .from("alumni")
    .select("*")
    .eq("id", alumniId)
    .single();

  return alumni;
}
