import Link from "next/link";
import Image from "next/image";

export default function BookingConfirmPage() {
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            Verifique seu E-mail
          </h1>
          <p className="text-[var(--muted)] mb-8">
            Enviamos um link de verificação para seu e-mail USP. Clique no link para confirmar seu agendamento.
          </p>

          <div className="bg-[var(--surface-2)] p-4 rounded-xl mb-8 text-left border border-[var(--card-border)]">
            <h2 className="font-medium text-[var(--foreground)] mb-3">Próximos passos:</h2>
            <ul className="text-sm text-[var(--muted)] space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--primary-500)]/20 text-[var(--primary-500)] text-xs flex items-center justify-center">1</span>
                Abra seu e-mail USP
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--primary-500)]/20 text-[var(--primary-500)] text-xs flex items-center justify-center">2</span>
                Clique no link de verificação
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--primary-500)]/20 text-[var(--primary-500)] text-xs flex items-center justify-center">3</span>
                Sua sessão será confirmada
              </li>
            </ul>
          </div>

          <p className="text-xs text-[var(--muted)] mb-6">
            Não recebeu o e-mail? Verifique sua caixa de spam ou tente agendar novamente.
          </p>

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
        </div>
      </div>
    </main>
  );
}
