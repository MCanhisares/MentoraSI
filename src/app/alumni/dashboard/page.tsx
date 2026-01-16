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
            MentoraSI
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[var(--muted)]">{alumni.name || alumni.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Painel de Controle</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
            <h3 className="text-sm font-medium text-[var(--muted)] mb-1">
              Horários Disponíveis
            </h3>
            <p className="text-3xl font-bold text-[var(--foreground)]">{slotsCount || 0}</p>
            <Link
              href="/alumni/availability"
              className="text-primary-500 text-sm hover:text-primary-700 mt-2 inline-block"
            >
              Gerenciar disponibilidade
            </Link>
          </div>

          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
            <h3 className="text-sm font-medium text-[var(--muted)] mb-1">
              Próximas Sessões
            </h3>
            <p className="text-3xl font-bold text-[var(--foreground)]">
              {sessions?.length || 0}
            </p>
          </div>

          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
            <h3 className="text-sm font-medium text-[var(--muted)] mb-1">
              Status do Calendário
            </h3>
            <p className="text-lg font-medium text-[var(--success-text)]">
              {alumni.google_refresh_token ? "Conectado" : "Não Conectado"}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              Ações Rápidas
            </h2>
            <div className="space-y-3">
              <Link
                href="/alumni/availability"
                className="block w-full bg-primary-600 text-white text-center px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Definir sua Disponibilidade
              </Link>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              Próximas Sessões
            </h2>
            {sessions && sessions.length > 0 ? (
              <ul className="space-y-4">
                {sessions.map((session) => (
                  <li
                    key={session.id}
                    className="p-4 bg-[var(--surface-2)] rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-[var(--foreground)]">
                          {session.student_name || "Estudante"}
                        </p>
                        <p className="text-sm text-[var(--muted)]">
                          {format(new Date(session.session_date), "d 'de' MMMM, yyyy")} • {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {session.meeting_link && (
                          <a
                            href={session.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors"
                          >
                            Entrar
                          </a>
                        )}
                        {session.management_token && (
                          <a
                            href={`/sessao/${session.id}/cancelar?token=${session.management_token}`}
                            className="text-[var(--error-text)] hover:opacity-80 px-3 py-1 text-sm border border-[var(--error-text)] rounded"
                          >
                            Cancelar
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-[var(--muted)]">
                        <span className="text-[var(--foreground)]">E-mail:</span> {session.student_email}
                      </p>
                      {session.student_linkedin && (
                        <p className="text-[var(--muted)]">
                          <span className="text-[var(--foreground)]">LinkedIn:</span>{" "}
                          <a
                            href={session.student_linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-500 hover:text-primary-400"
                          >
                            Ver perfil
                          </a>
                        </p>
                      )}
                      {session.student_notes && (
                        <div className="mt-2 p-2 bg-[var(--card-bg)] rounded border border-[var(--card-border)]">
                          <p className="text-xs text-[var(--muted)] mb-1">Notas do estudante:</p>
                          <p className="text-[var(--foreground)] text-sm whitespace-pre-wrap">{session.student_notes}</p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[var(--muted)]">Nenhuma sessão próxima</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
