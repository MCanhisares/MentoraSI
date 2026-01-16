import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { LogoutButton } from "@/components/LogoutButton";
import type { Alumni, Session } from "@/types/database";

const SESSION_COOKIE_NAME = "alumni_session";

export default async function AlumniDashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    redirect("/alumni/login");
  }

  const alumniId = sessionCookie.value;
  const supabase = await createClient();

  // Get alumni data
  const { data: alumni } = await supabase
    .from("alumni")
    .select("*")
    .eq("id", alumniId)
    .single() as { data: Alumni | null };

  if (!alumni) {
    redirect("/alumni/login");
  }

  // Get upcoming sessions
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("alumni_id", alumniId)
    .gte("session_date", today)
    .eq("status", "confirmed")
    .order("session_date", { ascending: true })
    .limit(5) as { data: Session[] | null };

  // Get availability slots count
  const { count: slotsCount } = await supabase
    .from("availability_slots")
    .select("*", { count: "exact", head: true })
    .eq("alumni_id", alumniId);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <nav className="bg-[var(--card-bg)] border-b border-[var(--card-border)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-500">
            MentorMatch
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[var(--muted)]">{alumni.name || alumni.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
            <h3 className="text-sm font-medium text-[var(--muted)] mb-1">
              Availability Slots
            </h3>
            <p className="text-3xl font-bold text-[var(--foreground)]">{slotsCount || 0}</p>
            <Link
              href="/alumni/availability"
              className="text-primary-500 text-sm hover:text-primary-700 mt-2 inline-block"
            >
              Manage availability
            </Link>
          </div>

          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
            <h3 className="text-sm font-medium text-[var(--muted)] mb-1">
              Upcoming Sessions
            </h3>
            <p className="text-3xl font-bold text-[var(--foreground)]">
              {sessions?.length || 0}
            </p>
          </div>

          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
            <h3 className="text-sm font-medium text-[var(--muted)] mb-1">
              Calendar Status
            </h3>
            <p className="text-lg font-medium text-[var(--success-text)]">
              {alumni.google_refresh_token ? "Connected" : "Not Connected"}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/alumni/availability"
                className="block w-full bg-primary-600 text-white text-center px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Set Your Availability
              </Link>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              Upcoming Sessions
            </h2>
            {sessions && sessions.length > 0 ? (
              <ul className="space-y-3">
                {sessions.map((session) => (
                  <li
                    key={session.id}
                    className="flex justify-between items-center p-3 bg-[var(--surface-2)] rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-[var(--foreground)]">
                        {format(new Date(session.session_date), "MMM d, yyyy")}
                      </p>
                      <p className="text-sm text-[var(--muted)]">
                        {session.start_time} - {session.end_time}
                      </p>
                    </div>
                    {session.meeting_link && (
                      <a
                        href={session.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-700 text-sm"
                      >
                        Join Meeting
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[var(--muted)]">No upcoming sessions</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
