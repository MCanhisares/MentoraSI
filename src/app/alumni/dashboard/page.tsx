import Link from "next/link";
import Image from "next/image";
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
    <main className="min-h-screen bg-[var(--background)] relative">
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />

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
            <span className="text-sm text-[var(--muted)]">{alumni.name || alumni.email}</span>
            {alumni.is_admin && (
              <Link
                href="/alumni/admin"
                className="px-2 py-1 text-xs font-medium bg-[var(--primary-500)]/20 text-[var(--primary-500)] rounded-full hover:bg-[var(--primary-500)]/30 transition-colors"
              >
                Admin
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="relative max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Painel de Controle</h1>
          <p className="text-[var(--muted)]">Gerencie suas sessões de mentoria</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="glass p-6 rounded-2xl">
            <p className="text-sm text-[var(--muted)] mb-1">Horários Configurados</p>
            <p className="text-3xl font-bold text-[var(--foreground)]">{slotsCount || 0}</p>
            <Link
              href="/alumni/availability"
              className="text-[var(--primary-500)] text-sm hover:underline mt-2 inline-block"
            >
              Gerenciar →
            </Link>
          </div>

          <div className="glass p-6 rounded-2xl">
            <p className="text-sm text-[var(--muted)] mb-1">Próximas Sessões</p>
            <p className="text-3xl font-bold text-[var(--foreground)]">{sessions?.length || 0}</p>
          </div>

          <div className="glass p-6 rounded-2xl">
            <p className="text-sm text-[var(--muted)] mb-1">Google Calendar</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${alumni.google_refresh_token ? "bg-green-500" : "bg-red-500"}`} />
              <p className="font-medium text-[var(--foreground)]">
                {alumni.google_refresh_token ? "Conectado" : "Não Conectado"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="glass p-6 rounded-2xl">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Ações Rápidas
              </h2>
              <Link
                href="/alumni/availability"
                className="gradient-btn block w-full text-white text-center px-4 py-3 rounded-xl font-medium"
              >
                Definir Disponibilidade
              </Link>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Recursos para Mentores
              </h2>
              <a
                href="https://mentorasi.notion.site/2926f9fd18324aad99fec4982d4dd564?v=2eaf9d830f0780079579000c8d9ee0b5"
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-btn block w-full text-white text-center px-4 py-3 rounded-xl font-medium"
              >
                Acessar Wiki
              </a>
            </div>

            {alumni.is_admin && (
              <div className="glass p-6 rounded-2xl border-[var(--primary-500)]/30 border">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                  Administração
                  <span className="px-2 py-0.5 text-xs font-medium bg-[var(--primary-500)]/20 text-[var(--primary-500)] rounded-full">
                    Admin
                  </span>
                </h2>
                <Link
                  href="/alumni/admin"
                  className="block w-full text-[var(--primary-500)] text-center px-4 py-3 rounded-xl font-medium border border-[var(--primary-500)] hover:bg-[var(--primary-500)]/10 transition-colors"
                >
                  Gerenciar Convites
                </Link>
              </div>
            )}
          </div>

          {/* Upcoming Sessions */}
          <div className="lg:col-span-3">
            <div className="glass p-6 rounded-2xl">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Próximas Sessões
              </h2>
              {sessions && sessions.length > 0 ? (
                <ul className="space-y-3">
                  {sessions.map((session) => (
                    <li
                      key={session.id}
                      className="p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--card-border)]"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-[var(--foreground)]">
                            {session.student_name || "Estudante"}
                          </p>
                          <p className="text-sm text-[var(--muted)]">
                            {format(new Date(session.session_date), "d 'de' MMMM")} • {session.start_time.slice(0, 5)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {session.meeting_link && (
                            <a
                              href={session.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="gradient-btn text-white px-4 py-1.5 rounded-lg text-sm font-medium"
                            >
                              Entrar
                            </a>
                          )}
                          {session.management_token && (
                            <a
                              href={`/session/${session.id}/cancel?token=${session.management_token}`}
                              className="text-[var(--error-text)] hover:bg-[var(--error-bg)] px-3 py-1.5 text-sm border border-[var(--error-text)]/50 rounded-lg transition-colors"
                            >
                              Cancelar
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="text-[var(--muted)]">
                          {session.student_email}
                        </p>
                        {session.student_linkedin && (
                          <a
                            href={session.student_linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--primary-500)] hover:underline text-xs"
                          >
                            Ver LinkedIn
                          </a>
                        )}
                        {session.student_notes && (
                          <div className="mt-2 p-3 bg-[var(--surface-1)] rounded-lg">
                            <p className="text-xs text-[var(--muted)] mb-1">Notas:</p>
                            <p className="text-[var(--foreground)] text-sm">{session.student_notes}</p>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[var(--muted)] text-center py-8">Nenhuma sessão agendada</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
