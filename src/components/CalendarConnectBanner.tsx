"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function CalendarConnectBanner() {
  const searchParams = useSearchParams();
  const calendarConnected = searchParams.get("calendar_connected");
  const calendarError = searchParams.get("calendar_error");
  const [showBanner, setShowBanner] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (calendarConnected === "true") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
    if (calendarError) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  }, [calendarConnected, calendarError]);

  if (!showBanner) {
    return null;
  }

  const getErrorMessage = () => {
    switch (calendarError) {
      case "access_denied":
        return "Acesso negado ao Google Calendar. Por favor, tente novamente.";
      case "no_code":
        return "Código de autenticação não recebido. Tente novamente.";
      case "connection_failed":
        return "Falha ao conectar com o Google Calendar. Tente novamente.";
      default:
        return "Erro ao conectar com o Google Calendar.";
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="mb-6 glass p-4 rounded-2xl border border-green-500/20 bg-green-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-400">Google Calendar conectado com sucesso!</p>
              <p className="text-sm text-green-400/80 mt-1">
                Suas sessões agendadas agora serão automaticamente adicionadas ao seu calendário.
              </p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-green-400/60 hover:text-green-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {showError && (
        <div className="mb-6 glass p-4 rounded-2xl border border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-red-400">Erro ao conectar Google Calendar</p>
              <p className="text-sm text-red-400/80 mt-1">{getErrorMessage()}</p>
            </div>
            <button
              onClick={() => setShowError(false)}
              className="text-red-400/60 hover:text-red-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {!showSuccess && (
        <div className="mb-6 glass p-4 rounded-2xl border border-[var(--primary-500)]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-500)]/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[var(--primary-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-[var(--foreground)]">Conecte seu Google Calendar</p>
              <p className="text-sm text-[var(--muted)] mt-1">
                Adicione automaticamente sessões agendadas ao seu calendário e crie links de reunião do Google Meet.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/api/auth/google-calendar"
                className="gradient-btn text-white px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap"
              >
                Conectar
              </a>
              <button
                onClick={() => setShowBanner(false)}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
