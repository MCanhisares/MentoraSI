import { Header } from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

const mentors = [
  {
    name: "Marcel Canhisares",
    linkedin: "https://www.linkedin.com/in/marcel-canhisares/",
    photo: "https://media.licdn.com/dms/image/v2/C5603AQEGkwlOZix1LA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1539368550748?e=2147483647&v=beta&t=UNXpyF2ya_85kMXNuTib_v1QQjAayOyTmFfP7bUkfHI",
    role: "Software Engineer Manager @ Questrade",
  },
  {
    name: "Bruno Murozaki",
    linkedin: "https://www.linkedin.com/in/brunomurozaki/",
    photo: "https://media.licdn.com/dms/image/v2/D4D03AQEVMDWqE6fQLQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1683655665695?e=2147483647&v=beta&t=XbpsgnQB8dRJUONbPzhi1zkWhEWE3j9gnZeJURkvFxk",
    role: "Software Engineer @ Magie",
  },
  {
    name: "Luis Cervera",
    linkedin: "https://www.linkedin.com/in/lcervera94/",
    photo: "https://media.licdn.com/dms/image/v2/D4D03AQE7_WCiT1jsgQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1706579650042?e=1770249600&v=beta&t=UMeF28mkyeDNZ66dLNNWOTpx1qkrfvUyeHimFb6ZduE",
    role: "Associate Director @ Credit Suisse Brasil",
  },
  {
    name: "Abel Rocha Espinosa",
    linkedin: "https://www.linkedin.com/in/abel-rocha-espinosa/",
    photo: "https://media.licdn.com/dms/image/v2/D5603AQH_0S_0SYe4ag/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1707775982518?e=1770249600&v=beta&t=I1dnt4bt43yosHQiemlj3C-P7h0ewXGEgJI0zzub_EY",
    role: "Software Engineer @ Cayena",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] translate-y-1/2" />

      <Header />

      {/* Hero Section */}
      <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-[var(--muted)] mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Mentoria de carreira com ex-alunos USP
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-[var(--foreground)] mb-6 leading-tight">
            Conecte-se com
            <span className="block gradient-text">mentores experientes</span>
          </h1>

          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-12 leading-relaxed">
            Receba orientação profissional de ex-alunos da USP que estão no mercado de trabalho.
            Agende sessões e acelere sua carreira.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/book"
              className="gradient-btn text-white px-8 py-4 rounded-xl text-lg font-semibold"
            >
              Agendar Mentoria
            </Link>
            <Link
              href="/alumni/login"
              className="px-8 py-4 rounded-xl text-lg font-semibold text-[var(--foreground)] border border-[var(--card-border)] hover:border-[var(--primary-500)] hover:bg-[var(--surface-2)] transition-all"
            >
              Ser um Mentor
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section - Minimal */}
      <div className="relative max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div className="group">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--card-border)] flex items-center justify-center group-hover:border-[var(--primary-500)] transition-colors">
              <svg
                className="w-7 h-7 text-[var(--primary-500)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Ex-Alunos USP
            </h3>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              Mentores que estudaram na mesma universidade e entendem sua jornada.
            </p>
          </div>

          <div className="group">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--card-border)] flex items-center justify-center group-hover:border-[var(--primary-500)] transition-colors">
              <svg
                className="w-7 h-7 text-[var(--primary-500)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Agendamento Simples
            </h3>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              Escolha um horário que funciona para você. Sem burocracia.
            </p>
          </div>

          <div className="group">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--card-border)] flex items-center justify-center group-hover:border-[var(--primary-500)] transition-colors">
              <svg
                className="w-7 h-7 text-[var(--primary-500)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              100% Gratuito para alunos USP
            </h3>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              Aproveite sessões de mentoria sem custo algum durante sua jornada acadêmica.
            </p>
          </div>
        </div>
      </div>

      {/* Mentors Section */}
      <div className="relative max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-3">
            Conheça os Mentores
          </h2>
          <p className="text-[var(--muted)]">
            Ex-Alunos da USP prontos para ajudar você a crescer profissionalmente.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {mentors.map((mentor) => (
            <a
              key={mentor.linkedin}
              href={mentor.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="glass p-6 rounded-2xl text-center group hover:border-[var(--primary-500)] transition-all hover:scale-105"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center">
                {mentor.photo ? (
                  <Image
                    src={mentor.photo}
                    alt={mentor.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl font-semibold">
                    {getInitials(mentor.name)}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--primary-500)] transition-colors">
                {mentor.name}
              </h3>
              <p className="text-xs text-[var(--muted)]">{mentor.role}</p>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-[var(--primary-500)]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-8 text-center border-t border-[var(--card-border)]">
        <div className="flex justify-center gap-6 text-sm text-[var(--muted)]">
          <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">
            Privacidade
          </Link>
          <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">
            Termos
          </Link>
        </div>
      </footer>
    </main>
  );
}
