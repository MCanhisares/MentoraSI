import Link from "next/link";

export default function BookingConfirmPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]" />

      <div className="relative max-w-md w-full mx-4">
        <div className="glass p-8 rounded-2xl text-center">
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
            Sessão Agendada!
          </h1>
          <p className="text-[var(--muted)] mb-8">
            Sua mentoria foi confirmada. Verifique seu e-mail para os detalhes.
          </p>

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
              ← Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
