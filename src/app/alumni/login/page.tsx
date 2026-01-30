"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function AlumniLoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const needsInvite = searchParams.get("needs_invite") === "true";

  const [inviteToken, setInviteToken] = useState("");
  const [showInviteInput, setShowInviteInput] = useState(needsInvite);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/supabase/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite_token: inviteToken || null }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setIsLoading(false);
    }
  };

  const getErrorMessage = () => {
    switch (error) {
      case "invalid_invite":
      case "invalid_invite_token":
        return "Token de convite inválido ou expirado.";
      case "invite_required":
        return "Você precisa de um token de convite para criar uma conta.";
      case "access_denied":
        return "Acesso negado. Tente novamente.";
      case "auth_failed":
      case "exchange_failed":
      case "callback_failed":
        return "Falha na autenticação. Tente novamente.";
      case "no_code":
        return "Código de autenticação não recebido. Tente novamente.";
      default:
        return null;
    }
  };

  const errorMessage = getErrorMessage();

  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-600/15 rounded-full blur-[80px]" />

      <div className="relative max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="MentoraSI"
              width={44}
              height={44}
              className="rounded-lg"
            />
            <span className="text-2xl font-semibold text-[var(--foreground)] group-hover:text-[var(--primary-500)] transition-colors">
              MentoraSI
            </span>
          </Link>
        </div>

        <div className="glass p-8 rounded-2xl">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2 text-center">
            Área do Mentor
          </h1>
          <p className="text-[var(--muted)] text-center mb-6 text-sm">
            {showInviteInput
              ? "Insira seu token de convite para criar uma conta."
              : "Entre com o Google para gerenciar sua disponibilidade."}
          </p>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
              {errorMessage}
            </div>
          )}

          {showInviteInput && (
            <div className="mb-6">
              <label
                htmlFor="inviteToken"
                className="block text-sm font-medium text-[var(--foreground)] mb-2"
              >
                Token de Convite
              </label>
              <input
                type="text"
                id="inviteToken"
                value={inviteToken}
                onChange={(e) => setInviteToken(e.target.value)}
                placeholder="Insira seu token de convite"
                className="w-full border border-[var(--card-border)] bg-[var(--surface-2)] rounded-xl px-4 py-3 text-[var(--foreground)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)]"
              />
              <p className="text-xs text-[var(--muted)] mt-2">
                Não tem um token? Entre em contato com um administrador.
              </p>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading || (showInviteInput && !inviteToken)}
            className="flex items-center justify-center gap-3 w-full bg-white text-gray-800 rounded-xl px-6 py-3.5 font-medium hover:bg-gray-50 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {isLoading ? "Carregando..." : "Continuar com Google"}
          </button>

          {!showInviteInput && (
            <button
              onClick={() => setShowInviteInput(true)}
              className="w-full mt-4 text-sm text-[var(--muted)] hover:text-[var(--primary-500)] transition-colors"
            >
              Primeira vez? Tenho um token de convite
            </button>
          )}

          {showInviteInput && (
            <button
              onClick={() => {
                setShowInviteInput(false);
                setInviteToken("");
              }}
              className="w-full mt-4 text-sm text-[var(--muted)] hover:text-[var(--primary-500)] transition-colors"
            >
              Já tenho uma conta
            </button>
          )}

          <p className="text-xs text-[var(--muted)] text-center mt-6 leading-relaxed">
            Ao entrar, você concorda com nossos{" "}
            <Link href="/terms" className="text-[var(--primary-500)] hover:underline">
              Termos
            </Link>{" "}
            e{" "}
            <Link href="/privacy" className="text-[var(--primary-500)] hover:underline">
              Privacidade
            </Link>
          </p>
        </div>

        <p className="text-center mt-8">
          <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--primary-500)] transition-colors">
            ← Voltar ao Início
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function AlumniLoginPage() {
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
      <AlumniLoginContent />
    </Suspense>
  );
}
