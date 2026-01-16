import Link from "next/link";
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
    <main className="min-h-screen bg-[var(--background)]">
      <nav className="bg-[var(--card-bg)] border-b border-[var(--card-border)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-500">
            MentoraSI
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/alumni/dashboard"
              className="text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Painel de Controle
            </Link>
            <span className="text-[var(--muted)]">{alumni.name || alumni.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Definir sua Disponibilidade
          </h1>
          <p className="text-[var(--muted)]">
            Defina quando você está disponível para sessões de mentoria. Use o Cronograma Semanal
            para disponibilidade recorrente ou Datas Individuais para horários específicos únicos.
          </p>
        </div>

        <AvailabilityPageContent alumniId={alumniId} slots={slots} />
      </div>
    </main>
  );
}
