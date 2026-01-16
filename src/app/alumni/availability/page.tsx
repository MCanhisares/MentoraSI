import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AvailabilityForm } from "@/components/AvailabilityForm";
import { LogoutButton } from "@/components/LogoutButton";
import type { Alumni, AvailabilitySlot } from "@/types/database";

const SESSION_COOKIE_NAME = "alumni_session";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default async function AvailabilityPage() {
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

  // Get existing availability slots
  const { data: slots } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("alumni_id", alumniId)
    .order("day_of_week", { ascending: true }) as { data: AvailabilitySlot[] | null };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-700">
            MentorMatch
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/alumni/dashboard"
              className="text-gray-600 hover:text-gray-800"
            >
              Dashboard
            </Link>
            <span className="text-gray-600">{alumni.name || alumni.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Set Your Availability
          </h1>
          <p className="text-gray-600">
            Define when you are available for mentoring sessions. Students will be
            able to book during these times.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add Availability
          </h2>
          <AvailabilityForm alumniId={alumniId} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Current Availability
          </h2>

          {slots && slots.length > 0 ? (
            <div className="space-y-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {DAYS_OF_WEEK[slot.day_of_week]}
                    </p>
                    <p className="text-sm text-gray-500">
                      {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    </p>
                  </div>
                  <form action={`/api/availability?id=${slot.id}`} method="POST">
                    <input type="hidden" name="_method" value="DELETE" />
                    <button
                      type="submit"
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No availability set yet. Add your first time slot above.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
