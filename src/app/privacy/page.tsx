import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Política de Privacidade - MentoraSI",
  description: "Política de Privacidade para a plataforma de mentoria MentoraSI",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <nav className="px-6 py-4 border-b border-[var(--card-border)]/50">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <Image
              src="/logo.png"
              alt="MentoraSI"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-xl font-semibold text-[var(--foreground)] group-hover:text-[var(--primary-500)] transition-colors">
              MentoraSI
            </span>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-8">Política de Privacidade</h1>

        <div className="glass rounded-2xl p-8 prose prose-invert max-w-none">
          <p className="text-[var(--muted)] mb-6">
            <strong>Última atualização:</strong> Janeiro 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">1. Introdução</h2>
            <p className="text-[var(--muted)] mb-4">
              MentoraSI (&quot;nós&quot;, &quot;nosso&quot; ou &quot;da nossa&quot;) está comprometida em proteger sua privacidade.
              Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas
              informações quando você usa nossa plataforma de mentoria de alunos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">2. Informações que Coletamos</h2>

            <h3 className="text-xl font-medium text-[var(--foreground)] mb-3">Para Ex-Alunos (Mentores)</h3>
            <ul className="list-disc pl-6 text-[var(--muted)] mb-4 space-y-2">
              <li>Endereço de e-mail (via Google OAuth)</li>
              <li>Nome (via Google OAuth)</li>
              <li>Tokens de acesso ao Google Calendar (para criar eventos de reunião)</li>
              <li>Cronograma de disponibilidade que você define</li>
            </ul>

            <h3 className="text-xl font-medium text-[var(--foreground)] mb-3">Para Estudantes</h3>
            <ul className="list-disc pl-6 text-[var(--muted)] mb-4 space-y-2">
              <li>Endereço de e-mail (fornecido ao agendar)</li>
              <li>Preferências de agendamento e histórico de sessões</li>
            </ul>

            <h3 className="text-xl font-medium text-[var(--foreground)] mb-3">Coletadas Automaticamente</h3>
            <ul className="list-disc pl-6 text-[var(--muted)] space-y-2">
              <li>Dados de log (endereço IP, tipo de navegador, páginas visitadas)</li>
              <li>Cookies para gerenciamento de sessão</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">3. Como Usamos Suas Informações</h2>
            <ul className="list-disc pl-6 text-[var(--muted)] space-y-2">
              <li>Para criar eventos de calendário para sessões agendadas</li>
              <li>Para enviar confirmações e lembretes de agendamento via e-mail</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">4. Serviços da API do Google</h2>
            <p className="text-[var(--muted)] mb-4">
              Nosso uso de informações recebidas das APIs do Google adere à{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                className="text-[var(--primary-500)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Dados do Usuário dos Serviços da API do Google
              </a>
              , incluindo os requisitos de Uso Limitado.
            </p>
            <p className="text-[var(--muted)]">
              Solicitamos acesso ao Google Calendar apenas para criar eventos de reunião para
              sessões agendadas. Não lemos, modificamos ou excluímos nenhum evento de calendário existente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">5. Compartilhamento e Divulgação de Dados</h2>
            <p className="text-[var(--muted)] mb-4">Não vendemos suas informações pessoais. Podemos compartilhar dados com:</p>
            <ul className="list-disc pl-6 text-[var(--muted)] space-y-2">
              <li><strong className="text-[var(--foreground)]">Prestadores de Serviços:</strong> Serviços de terceiros que nos ajudam a operar (ex: Supabase para banco de dados, Resend para e-mails, Vercel para hospedagem)</li>
              <li><strong className="text-[var(--foreground)]">Participantes da Sessão:</strong> Quando uma sessão é agendada, o e-mail do estudante é compartilhado com o mentor ex-aluno correspondente</li>
              <li><strong className="text-[var(--foreground)]">Requisitos Legais:</strong> Se exigido por lei ou para proteger nossos direitos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">6. Segurança de Dados</h2>
            <p className="text-[var(--muted)]">
              Implementamos medidas técnicas e organizacionais apropriadas para proteger
              suas informações pessoais. No entanto, nenhum método de transmissão pela
              Internet é 100% seguro, e não podemos garantir segurança absoluta.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">7. Retenção de Dados</h2>
            <p className="text-[var(--muted)]">
              Mantemos suas informações enquanto sua conta está ativa ou conforme
              necessário para fornecer serviços. Você pode solicitar a exclusão de seus dados entrando
              em contato conosco.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">8. Seus Direitos</h2>
            <p className="text-[var(--muted)] mb-4">Você tem o direito de:</p>
            <ul className="list-disc pl-6 text-[var(--muted)] space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados imprecisos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar o acesso ao Google Calendar a qualquer momento através das configurações da sua conta Google</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">9. Alterações nesta Política</h2>
            <p className="text-[var(--muted)]">
              Podemos atualizar esta Política de Privacidade de tempos em tempos. Iremos notificá-lo
              de quaisquer alterações postando a nova política nesta página e atualizando a
              data de &quot;Última atualização&quot;.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">10. Contato</h2>
            <p className="text-[var(--muted)]">
              Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em:{" "}
              <a href="mailto:support@mentorasi.com" className="text-[var(--primary-500)] hover:underline">
                support@mentorasi.com.br
              </a>
            </p>
          </section>
        </div>

        <div className="mt-8 text-center text-sm">
          <Link href="/" className="text-[var(--muted)] hover:text-[var(--primary-500)] transition-colors">
            ← Voltar ao Início
          </Link>
          <span className="mx-4 text-[var(--card-border)]">|</span>
          <Link href="/terms" className="text-[var(--muted)] hover:text-[var(--primary-500)] transition-colors">
            Termos de Serviço
          </Link>
        </div>
      </div>
    </main>
  );
}
