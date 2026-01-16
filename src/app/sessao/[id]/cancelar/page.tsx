"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

interface SessionData {
  id: string;
  student_email: string;
  student_name: string | null;
  session_date: string;
  start_time: string;
  end_time: string;
  status: string;
  alumni: {
    id: string;
    name: string;
  };
}

export default function CancelSessionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.id as string;
  const token = searchParams.get("token");

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token de acesso inválido");
      setLoading(false);
      return;
    }

    fetchSession();
  }, [sessionId, token]);

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar sessão");
      }

      if (data.session.status === "cancelled") {
        setError("Esta sessão já foi cancelada");
      } else {
        setSession(data.session);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar sessão");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!token) return;

    setCancelling(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, reason: reason || null }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cancelar sessão");
      }

      setCancelled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cancelar sessão");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-[var(--muted)]">Carregando...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
        <div className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--card-border)] max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[var(--error-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-[var(--error-text)]"
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
            Erro
          </h1>
          <p className="text-[var(--muted)] mb-6">{error}</p>
          <Link
            href="/"
            className="text-primary-500 hover:text-primary-400"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
    );
  }

  if (cancelled) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
        <div className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--card-border)] max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[var(--success-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-[var(--success-text)]"
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
            Sessão Cancelada
          </h1>
          <p className="text-[var(--muted)] mb-6">
            Sua sessão foi cancelada com sucesso. Ambas as partes receberão um e-mail de confirmação.
          </p>
          <Link
            href="/book"
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Agendar Nova Sessão
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <nav className="bg-[var(--card-bg)] border-b border-[var(--card-border)] px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-primary-500">
            MentoraSI
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        <div className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--card-border)]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--error-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[var(--error-text)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              Cancelar Sessão
            </h1>
            <p className="text-[var(--muted)]">
              Tem certeza que deseja cancelar esta sessão de mentoria?
            </p>
          </div>

          {session && (
            <div className="bg-[var(--surface-2)] p-4 rounded-lg mb-6">
              <p className="text-[var(--foreground)] font-medium mb-2">
                {formatDate(session.session_date)}
              </p>
              <p className="text-[var(--muted)]">
                {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
              </p>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-[var(--foreground)] mb-2"
            >
              Motivo do cancelamento <span className="text-[var(--muted)]">(opcional)</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Por favor, nos conte o motivo do cancelamento..."
              rows={3}
              className="w-full border border-[var(--card-border)] bg-[var(--surface-2)] rounded-lg px-4 py-2 text-[var(--foreground)] placeholder-[var(--muted)] focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 text-center px-6 py-3 border border-[var(--card-border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--surface-3)] transition-colors"
            >
              Voltar
            </Link>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex-1 bg-[var(--error-text)] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling ? "Cancelando..." : "Confirmar Cancelamento"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
