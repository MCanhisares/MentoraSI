import Link from "next/link";
import { BookingCalendar } from "@/components/BookingCalendar";

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <nav className="bg-[var(--card-bg)] border-b border-[var(--card-border)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-500">
            MentoraSI
          </Link>
          <Link
            href="/alumni/login"
            className="text-primary-500 hover:text-primary-700 font-medium"
          >
            Login de Ex-Alunos
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Agendar uma Sessão de Mentoria
          </h1>
          <p className="text-[var(--muted)]">
            Selecione um horário disponível para agendar uma sessão anônima com um
            mentor ex-aluno. Você não saberá com quem está se encontrando até a sessão.
          </p>
        </div>

        <BookingCalendar />
      </div>
    </main>
  );
}
