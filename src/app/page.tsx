import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <nav className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-primary-500">MentoraSI</h1>
        <Link
          href="/alumni/login"
          className="text-primary-500 hover:text-primary-700 font-medium"
        >
          Login de Ex-Alunos
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-[var(--foreground)] mb-6">
            Mentoria Anônima de Ex-Alunos
          </h2>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10">
            Receba orientação profissional de ex-alunos experientes. Agende sessões anonimamente
            - foque nos conselhos, não nos nomes.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/book"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Agendar uma Sessão
            </Link>
            <Link
              href="/alumni/login"
              className="border-2 border-primary-500 text-primary-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[var(--surface-2)] transition-colors"
            >
              Ser um Mentor
            </Link>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--card-border)]">
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              Agendamento Anônimo
            </h3>
            <p className="text-[var(--muted)]">
              Agende sessões sem saber quem encontrará. Foque puramente em
              receber conselhos valiosos.
            </p>
          </div>

          <div className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--card-border)]">
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              Agendamento Flexível
            </h3>
            <p className="text-[var(--muted)]">
              Ex-alunos definem sua disponibilidade. Estudantes escolhem entre horários
              agregados que funcionam para eles.
            </p>
          </div>

          <div className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--card-border)]">
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              Sincronização Instantânea de Calendário
            </h3>
            <p className="text-[var(--muted)]">
              As sessões aparecem automaticamente no Google Calendar. Não é necessária
              coordenação manual.
            </p>
          </div>
        </div>
      </div>

      <footer className="py-8 text-center text-[var(--muted)] text-sm border-t border-[var(--card-border)]">
        <p className="mb-4">Conecte estudantes com mentores ex-alunos anonimamente</p>
        <div className="flex justify-center gap-6">
          <Link href="/privacy" className="hover:text-[var(--foreground)]">
            Política de Privacidade
          </Link>
          <Link href="/terms" className="hover:text-[var(--foreground)]">
            Termos de Serviço
          </Link>
        </div>
      </footer>
    </main>
  );
}
