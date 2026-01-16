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
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-700">
            MentorMatch
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{alumni.name || alumni.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Availability Slots
            </h3>
            <p className="text-3xl font-bold text-gray-900">{slotsCount || 0}</p>
            <Link
              href="/alumni/availability"
              className="text-primary-600 text-sm hover:text-primary-800 mt-2 inline-block"
            >
              Manage availability
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Upcoming Sessions
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {sessions?.length || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Calendar Status
            </h3>
            <p className="text-lg font-medium text-green-600">
              {alumni.google_refresh_token ? "Connected" : "Not Connected"}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
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

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upcoming Sessions
            </h2>
            {sessions && sessions.length > 0 ? (
              <ul className="space-y-3">
                {sessions.map((session) => (
                  <li
                    key={session.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {format(new Date(session.session_date), "MMM d, yyyy")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {session.start_time} - {session.end_time}
                      </p>
                    </div>
                    {session.meeting_link && (
                      <a
                        href={session.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800 text-sm"
                      >
                        Join Meeting
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No upcoming sessions</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
