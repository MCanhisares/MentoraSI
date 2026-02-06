import { Header } from "@/components/Header";
import MentorsMarquee from "@/components/MentorsMarquee";
import Link from "next/link";

const mentors = [
  {
    name: "Marcel Canhisares",
    linkedin: "https://www.linkedin.com/in/marcel-canhisares/",
    photo: "https://media.licdn.com/dms/image/v2/C5603AQEGkwlOZix1LA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1539368550748?e=2147483647&v=beta&t=UNXpyF2ya_85kMXNuTib_v1QQjAayOyTmFfP7bUkfHI",
    role: "Software Engineer Manager @ Questrade",
  },
  {
    name: "Débora Atanes Buss",
    linkedin: "https://www.linkedin.com/in/deboraatanes/",
    photo: "https://media.licdn.com/dms/image/v2/C4D03AQFeqBnYWdgoOg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1622672883458?e=1771459200&v=beta&t=ykO1fT1oRMr8Qrd4E_xOC0otVfnPvqG_TQjsaGnecb8",
    role: "Principal Software Engineer | Tech Manager @ Tupinambá",
  },
  {
    name: "Luis Cervera",
    linkedin: "https://www.linkedin.com/in/lcervera94/",
    photo: "https://media.licdn.com/dms/image/v2/D4D03AQE7_WCiT1jsgQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1706579650042?e=1770249600&v=beta&t=UMeF28mkyeDNZ66dLNNWOTpx1qkrfvUyeHimFb6ZduE",
    role: "Associate Director @ Credit Suisse Brasil",
  },
  {
    name: "Felipe Castro",
    linkedin: "https://www.linkedin.com/in/leddo/",
    photo: "https://media.licdn.com/dms/image/v2/D4D03AQEgkIf_oX8zcg/profile-displayphoto-crop_800_800/B4DZkGu7OSH0AI-/0/1756754589325?e=1771459200&v=beta&t=h7Jy23DekbZrvstREMB7_fbO6we73bAN90hE2UZEwXI",
    role: "Senior Frontend Developer @ Entourage Yearbooks",
  },
  {
    name: "Yann Righas Abrahão",
    linkedin: "https://www.linkedin.com/in/yann-righas-abrahao/",
    photo: "https://media.licdn.com/dms/image/v2/D4D03AQFxFrVjeIL3oQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1636929416883?e=1772064000&v=beta&t=4fIUN78B_76JQ2p_pYgfz7Mn6lbFleDPc7EKweGz1as",
    role: "Cientista de Dados @ Shopee",
  }
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
            {/* <Link
              href="/alumni/login"
              className="px-8 py-4 rounded-xl text-lg font-semibold text-[var(--foreground)] border border-[var(--card-border)] hover:border-[var(--primary-500)] hover:bg-[var(--surface-2)] transition-all"
            >
              Ser um Mentor
            </Link> */}
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

      {/* Mentorship Program Section */}
      <div className="relative max-w-5xl mx-auto px-6 ">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            Como o Programa de Mentoria Funciona
          </h2>
          <p className="text-xl text-[var(--muted)] max-w-3xl mx-auto leading-relaxed">
            Nossos mentores estão aqui para ajudar você a navegar sua jornada profissional com 
            orientação personalizada e insights sobre o mercado de tecnologia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[var(--card-bg)] p-8 rounded-2xl border border-[var(--card-border)] hover:border-[var(--primary-500)] transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              Planejamento de Carreira
            </h3>
            <p className="text-[var(--muted)] leading-relaxed">
              Receba ajuda para definir seus objetivos profissionais, identificar suas forças e 
              criar um plano de carreira alinhado com seus interesses e o mercado atual.
            </p>
          </div>

          <div className="bg-[var(--card-bg)] p-8 rounded-2xl border border-[var(--card-border)] hover:border-[var(--primary-500)] transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              Preparação para Entrevistas
            </h3>
            <p className="text-[var(--muted)] leading-relaxed">
              Treine suas habilidades para entrevistas técnicas e comportamentais, 
              receba feedback construtivo e aumente sua confiança para conquistar as melhores oportunidades.
            </p>
          </div>

          <div className="bg-[var(--card-bg)] p-8 rounded-2xl border border-[var(--card-border)] hover:border-[var(--primary-500)] transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-white"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              Mercado de Tecnologia
            </h3>
            <p className="text-[var(--muted)] leading-relaxed">
              Entenda tendências atuais, salários praticados, tecnologias em alta e 
              receba insights sobre como se destacar no competitivo mercado tech brasileiro.
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

        <MentorsMarquee mentors={mentors} />
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
