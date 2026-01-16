import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";
import { AvailabilityPageContent } from "@/components/AvailabilityPageContent";
import type { Alumni, AvailabilitySlot } from "@/types/database";

const SESSION_COOKIE_NAME = "alumni_session";

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

  // Get existing availability slots - order by specific_date for individual, then day_of_week for recurring
  const { data: slots } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("alumni_id", alumniId)
    .order("is_recurring", { ascending: false })
    .order("day_of_week", { ascending: true })
    .order("specific_date", { ascending: true }) as { data: AvailabilitySlot[] | null };

  return (
    <main className="min-h-screen bg-[var(--background)] relative">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

      <nav className="relative px-6 py-4 border-b border-[var(--card-border)]/50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="MentoraSI"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-xl font-semibold text-[var(--foreground)] group-hover:text-[var(--primary-500)] transition-colors">
              MentoraSI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/alumni/dashboard"
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              ← Painel
            </Link>
            <span className="text-sm text-[var(--muted)]">{alumni.name || alumni.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="relative max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Disponibilidade
          </h1>
          <p className="text-[var(--muted)]">
            Configure quando você está disponível para mentorias. Sessões de 1 hora.
          </p>
        </div>

        <AvailabilityPageContent alumniId={alumniId} slots={slots} />
      </div>
    </main>
  );
}
