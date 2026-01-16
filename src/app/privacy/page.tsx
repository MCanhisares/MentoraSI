import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade - MentoraSI",
  description: "Política de Privacidade para a plataforma de mentoria anônima de ex-alunos MentoraSI",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-primary-700">
            MentoraSI
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Última atualização:</strong> Janeiro 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introdução</h2>
            <p className="text-gray-700 mb-4">
              MentoraSI (&quot;nós&quot;, &quot;nosso&quot; ou &quot;da nossa&quot;) está comprometida em proteger sua privacidade.
              Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas
              informações quando você usa nossa plataforma de mentoria anônima de ex-alunos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Informações que Coletamos</h2>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Para Ex-Alunos (Mentores)</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Endereço de e-mail (via Google OAuth)</li>
              <li>Nome (via Google OAuth)</li>
              <li>Tokens de acesso ao Google Calendar (para criar eventos de reunião)</li>
              <li>Cronograma de disponibilidade que você define</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Para Estudantes</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Endereço de e-mail (fornecido ao agendar)</li>
              <li>Preferências de agendamento e histórico de sessões</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Coletadas Automaticamente</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Dados de log (endereço IP, tipo de navegador, páginas visitadas)</li>
              <li>Cookies para gerenciamento de sessão</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Como Usamos Suas Informações</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Para facilitar agendamentos de sessões de mentoria anônima</li>
              <li>Para criar eventos de calendário para sessões agendadas</li>
              <li>Para enviar confirmações e lembretes de agendamento via e-mail</li>
              <li>Para manter e melhorar nossa plataforma</li>
              <li>Para comunicar atualizações importantes sobre nosso serviço</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Serviços da API do Google</h2>
            <p className="text-gray-700 mb-4">
              Nosso uso de informações recebidas das APIs do Google adere à{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                className="text-primary-600 hover:text-primary-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Dados do Usuário dos Serviços da API do Google
              </a>
              , incluindo os requisitos de Uso Limitado.
            </p>
            <p className="text-gray-700">
              Solicitamos acesso ao Google Calendar apenas para criar eventos de reunião para
              sessões agendadas. Não lemos, modificamos ou excluímos nenhum evento de calendário existente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Compartilhamento e Divulgação de Dados</h2>
            <p className="text-gray-700 mb-4">Não vendemos suas informações pessoais. Podemos compartilhar dados com:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Prestadores de Serviços:</strong> Serviços de terceiros que nos ajudam a operar (ex: Supabase para banco de dados, Resend para e-mails, Vercel para hospedagem)</li>
              <li><strong>Participantes da Sessão:</strong> Quando uma sessão é agendada, o e-mail do estudante é compartilhado com o mentor ex-aluno correspondente</li>
              <li><strong>Requisitos Legais:</strong> Se exigido por lei ou para proteger nossos direitos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Anonimato</h2>
            <p className="text-gray-700">
              Nossa plataforma é projetada para fornecer agendamentos anônimos. Estudantes não podem ver
              com qual mentor ex-aluno se encontrarão até a sessão. As identidades dos ex-alunos não
              são exibidas na interface de agendamento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Segurança de Dados</h2>
            <p className="text-gray-700">
              Implementamos medidas técnicas e organizacionais apropriadas para proteger
              suas informações pessoais. No entanto, nenhum método de transmissão pela
              Internet é 100% seguro, e não podemos garantir segurança absoluta.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Retenção de Dados</h2>
            <p className="text-gray-700">
              Mantemos suas informações enquanto sua conta está ativa ou conforme
              necessário para fornecer serviços. Você pode solicitar a exclusão de seus dados entrando
              em contato conosco.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Seus Direitos</h2>
            <p className="text-gray-700 mb-4">Você tem o direito de:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados imprecisos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar o acesso ao Google Calendar a qualquer momento através das configurações da sua conta Google</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Alterações nesta Política</h2>
            <p className="text-gray-700">
              Podemos atualizar esta Política de Privacidade de tempos em tempos. Iremos notificá-lo
              de quaisquer alterações postando a nova política nesta página e atualizando a
              data de &quot;Última atualização&quot;.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contato</h2>
            <p className="text-gray-700">
              Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em:{" "}
              <a href="mailto:support@mentorasi.com" className="text-primary-600 hover:text-primary-800">
                support@mentorasi.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary-600 hover:text-primary-800">
            Voltar ao Início
          </Link>
          <span className="mx-4 text-gray-400">|</span>
          <Link href="/terms" className="text-primary-600 hover:text-primary-800">
            Termos de Serviço
          </Link>
        </div>
      </div>
    </main>
  );
}
