import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Termos de Serviço - MentoraSI",
  description: "Termos de Serviço para a plataforma de mentoria de alunos MentoraSI",
};

export default function TermsOfServicePage() {
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
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-8">Termos de Serviço</h1>

        <div className="glass rounded-2xl p-8 prose prose-invert max-w-none">
          <p className="text-[var(--muted)] mb-6">
            <strong>Última atualização:</strong> Janeiro 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">1. Aceitação dos Termos</h2>
            <p className="text-[var(--muted)]">
              Ao acessar ou usar MentoraSI (&quot;o Serviço&quot;), você concorda em ficar vinculado
              a estes Termos de Serviço. Se você não concordar com estes termos, por favor, não
              use o Serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">2. Descrição do Serviço</h2>
            <p className="text-[var(--muted)]">
              MentoraSI é uma plataforma de mentoria que conecta estudantes
              universitários com mentores ex-alunos. A plataforma permite que ex-alunos definam sua
              disponibilidade e estudantes agendem sessões de mentoria.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">3. Contas de Usuário</h2>

            <h3 className="text-xl font-medium text-[var(--foreground)] mb-3">Contas de Ex-Alunos</h3>
            <ul className="list-disc pl-6 text-[var(--muted)] mb-4 space-y-2">
              <li>Você deve autenticar usando uma conta Google válida</li>
              <li>Você deve fornecer informações precisas sobre sua disponibilidade</li>
              <li>Você é responsável por manter a confidencialidade de sua conta</li>
              <li>Você nos concede permissão para acessar seu Google Calendar para criar eventos de reunião</li>
            </ul>

            <h3 className="text-xl font-medium text-[var(--foreground)] mb-3">Agendamentos de Estudantes</h3>
            <ul className="list-disc pl-6 text-[var(--muted)] space-y-2">
              <li>Você deve fornecer um endereço de e-mail válido ao agendar</li>
              <li>Você concorda em comparecer às sessões agendadas ou cancelar com antecedência</li>
              <li>Você entende que a identidade do mentor é revelada apenas durante a sessão</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">4. Uso Aceitável</h2>
            <p className="text-[var(--muted)] mb-4">Você concorda em não:</p>
            <ul className="list-disc pl-6 text-[var(--muted)] space-y-2">
              <li>Usar o Serviço para qualquer propósito ilegal</li>
              <li>Assediar, abusar ou prejudicar outros usuários</li>
              <li>Se passar por qualquer pessoa ou entidade</li>
              <li>Interferir ou perturbar o Serviço</li>
              <li>Tentar obter acesso não autorizado a qualquer parte do Serviço</li>
              <li>Usar o Serviço para enviar spam ou comunicações não solicitadas</li>
              <li>Agendar sessões sem intenção de comparecer</li>
              <li>Compartilhar informações confidenciais divulgadas durante sessões de mentoria sem consentimento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">5. Sessões de Mentoria</h2>
            <ul className="list-disc pl-6 text-[var(--muted)] space-y-2">
              <li>As sessões são apenas para fins educacionais e orientação profissional</li>
              <li>Os mentores fornecem conselhos baseados em sua experiência pessoal; isto não é consultoria profissional</li>
              <li>Não garantimos nenhum resultado específico das sessões de mentoria</li>
              <li>Ambas as partes devem tratar umas às outras com respeito e profissionalismo</li>
              <li>As sessões podem ser conduzidas via Google Meet ou outras ferramentas de videoconferência</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">6. Cancelamentos</h2>
            <p className="text-[var(--muted)]">
              Encorajamos os usuários a cancelar sessões o mais cedo possível se não puderem
              comparecer. Faltas repetidas podem resultar em restrições ou encerramento da conta.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">7. Propriedade Intelectual</h2>
            <p className="text-[var(--muted)]">
              O Serviço e seu conteúdo original, recursos e funcionalidades são
              de propriedade da MentoraSI e são protegidos por direitos autorais internacionais,
              marcas registradas e outras leis de propriedade intelectual.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">8. Privacidade</h2>
            <p className="text-[var(--muted)]">
              Seu uso do Serviço também é regido por nossa{" "}
              <Link href="/privacy" className="text-[var(--primary-500)] hover:underline">
                Política de Privacidade
              </Link>
              . Por favor, revise-a para entender nossas práticas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">9. Isenções de Responsabilidade</h2>
            <p className="text-[var(--muted)] mb-4">
              O SERVIÇO É FORNECIDO &quot;COMO ESTÁ&quot; E &quot;CONFORME DISPONÍVEL&quot; SEM GARANTIAS
              DE QUALQUER TIPO, SEJAM EXPRESSAS OU IMPLÍCITAS.
            </p>
            <ul className="list-disc pl-6 text-[var(--muted)] space-y-2">
              <li>Não garantimos a disponibilidade de mentores em qualquer momento</li>
              <li>Não verificamos as credenciais ou qualificações dos mentores ex-alunos</li>
              <li>Não somos responsáveis pelo conteúdo das sessões de mentoria</li>
              <li>Não garantimos que o Serviço será ininterrupto ou livre de erros</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">10. Limitação de Responsabilidade</h2>
            <p className="text-[var(--muted)]">
              NA MÁXIMA EXTENSÃO PERMITIDA POR LEI, A MENTORASI NÃO SERÁ RESPONSÁVEL
              POR QUAISQUER DANOS INDIRETOS, INCIDENTAIS, ESPECIAIS, CONSEQUENCIAIS OU PUNITIVOS,
              OU QUALQUER PERDA DE LUCROS OU RECEITAS, SEJAM INCORRIDOS DIRETA OU INDIRETAMENTE,
              OU QUALQUER PERDA DE DADOS, USO, BOA VONTADE OU OUTRAS PERDAS INTANGÍVEIS RESULTANTES
              DE SEU USO DO SERVIÇO.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">11. Encerramento</h2>
            <p className="text-[var(--muted)]">
              Podemos encerrar ou suspender seu acesso ao Serviço imediatamente,
              sem aviso prévio, por qualquer motivo, incluindo violação destes Termos.
              Você também pode excluir sua conta a qualquer momento entrando em contato conosco.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">12. Alterações nos Termos</h2>
            <p className="text-[var(--muted)]">
              Reservamo-nos o direito de modificar estes Termos a qualquer momento. Forneceremos
              aviso de alterações significativas postando os novos Termos nesta página.
              Seu uso continuado do Serviço após as alterações constitui aceitação
              dos novos Termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">13. Lei Aplicável</h2>
            <p className="text-[var(--muted)]">
              Estes Termos serão regidos e interpretados de acordo com as
              leis aplicáveis, sem consideração dos princípios de conflito de leis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">14. Contato</h2>
            <p className="text-[var(--muted)]">
              Se você tiver dúvidas sobre estes Termos, entre em contato conosco em:{" "}
              <a href="mailto:support@mentorasi.com" className="text-[var(--primary-500)] hover:underline">
                support@mentorasi.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-8 text-center text-sm">
          <Link href="/" className="text-[var(--muted)] hover:text-[var(--primary-500)] transition-colors">
            ← Voltar ao Início
          </Link>
          <span className="mx-4 text-[var(--card-border)]">|</span>
          <Link href="/privacy" className="text-[var(--muted)] hover:text-[var(--primary-500)] transition-colors">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </main>
  );
}
