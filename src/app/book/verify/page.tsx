"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";

interface SessionDetails {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  meeting_link?: string | null;
}

function VerifyBookingContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "already_verified" | "error">("loading");
  const [session, setSession] = useState<SessionDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Token de verificação não encontrado");
      return;
    }

    verifyBooking(token);
  }, [token]);

  const verifyBooking = async (verificationToken: string) => {
    try {
      const response = await fetch("/api/book/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Falha na verificação");
        return;
      }

      setSession(data.session);
      if (data.already_verified) {
        setStatus("already_verified");
      } else {
        setStatus("success");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Ocorreu um erro ao verificar seu agendamento");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]" />

      <div className="relative max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="MentoraSI"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-2xl font-semibold text-[var(--foreground)] group-hover:text-[var(--primary-500)] transition-colors">
              MentoraSI
            </span>
          </Link>
        </div>

        <div className="glass p-8 rounded-2xl text-center">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 bg-[var(--primary-500)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-[var(--primary-500)] animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                Verificando...
              </h1>
              <p className="text-[var(--muted)]">
                Aguarde enquanto confirmamos seu agendamento.
              </p>
            </>
          )}

          {status === "success" && session && (
            <>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                Sessão Confirmada!
              </h1>
              <p className="text-[var(--muted)] mb-8">
                Sua mentoria foi agendada com sucesso. Verifique seu e-mail para mais detalhes.
              </p>

              <div className="bg-[var(--surface-2)] p-4 rounded-xl mb-8 text-left border border-[var(--card-border)]">
                <h2 className="font-medium text-[var(--foreground)] mb-3">Detalhes da Sessão</h2>
                <div className="text-sm text-[var(--muted)] space-y-2">
                  <p>
                    <span className="text-[var(--foreground)]">Data:</span>{" "}
                    {format(parseISO(session.date), "EEEE, d 'de' MMMM 'de' yyyy")}
                  </p>
                  <p>
                    <span className="text-[var(--foreground)]">Horário:</span>{" "}
                    {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
                  </p>
                  {session.meeting_link && (
                    <p>
                      <span className="text-[var(--foreground)]">Link:</span>{" "}
                      <a
                        href={session.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--primary-500)] hover:underline"
                      >
                        Entrar na reunião
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-[var(--surface-2)] p-4 rounded-xl mb-8 text-left border border-[var(--card-border)]">
                <h2 className="font-medium text-[var(--foreground)] mb-3">Próximos passos:</h2>
                <ul className="text-sm text-[var(--muted)] space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--primary-500)]/20 text-[var(--primary-500)] text-xs flex items-center justify-center">1</span>
                    E-mail de confirmação enviado
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--primary-500)]/20 text-[var(--primary-500)] text-xs flex items-center justify-center">2</span>
                    Convite do calendário incluído
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--primary-500)]/20 text-[var(--primary-500)] text-xs flex items-center justify-center">3</span>
                    Entre na reunião no horário
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <Link
                  href="/book"
                  className="gradient-btn block w-full text-white text-center px-4 py-3 rounded-xl font-medium"
                >
                  Agendar Outra Sessão
                </Link>
                <Link
                  href="/"
                  className="block text-[var(--muted)] hover:text-[var(--primary-500)] transition-colors text-sm"
                >
                  Voltar ao Início
                </Link>
              </div>
            </>
          )}

          {status === "already_verified" && session && (
            <>
              <div className="w-16 h-16 bg-[var(--primary-500)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-[var(--primary-500)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                Sessão Já Confirmada
              </h1>
              <p className="text-[var(--muted)] mb-8">
                Este agendamento já foi verificado anteriormente.
              </p>

              <div className="bg-[var(--surface-2)] p-4 rounded-xl mb-8 text-left border border-[var(--card-border)]">
                <h2 className="font-medium text-[var(--foreground)] mb-3">Detalhes da Sessão</h2>
                <div className="text-sm text-[var(--muted)] space-y-2">
                  <p>
                    <span className="text-[var(--foreground)]">Data:</span>{" "}
                    {format(parseISO(session.date), "EEEE, d 'de' MMMM 'de' yyyy")}
                  </p>
                  <p>
                    <span className="text-[var(--foreground)]">Horário:</span>{" "}
                    {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/book"
                  className="gradient-btn block w-full text-white text-center px-4 py-3 rounded-xl font-medium"
                >
                  Agendar Outra Sessão
                </Link>
                <Link
                  href="/"
                  className="block text-[var(--muted)] hover:text-[var(--primary-500)] transition-colors text-sm"
                >
                  Voltar ao Início
                </Link>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                Erro na Verificação
              </h1>
              <p className="text-[var(--muted)] mb-8">
                {errorMessage}
              </p>

              <div className="space-y-3">
                <Link
                  href="/book"
                  className="gradient-btn block w-full text-white text-center px-4 py-3 rounded-xl font-medium"
                >
                  Tentar Novo Agendamento
                </Link>
                <Link
                  href="/"
                  className="block text-[var(--muted)] hover:text-[var(--primary-500)] transition-colors text-sm"
                >
                  Voltar ao Início
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function VerifyBookingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[var(--primary-500)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[var(--primary-500)] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-[var(--muted)]">Carregando...</p>
        </div>
      </main>
    }>
      <VerifyBookingContent />
    </Suspense>
  );
}
