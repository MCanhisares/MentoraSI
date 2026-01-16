import { Header } from "@/components/Header";
import { BookingCalendar } from "@/components/BookingCalendar";

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] relative">
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

      <Header />

      <div className="relative max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-3">
            Agendar Mentoria
          </h1>
          <p className="text-[var(--muted)] max-w-lg mx-auto">
            Escolha um horário disponível. Você será conectado com um mentor ex-aluno de Sistemas de Informação.
          </p>
        </div>

        <BookingCalendar />
      </div>
    </main>
  );
}
