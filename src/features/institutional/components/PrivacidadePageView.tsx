import { APP_NAME } from "@/constants/app";
import { CONTACT_EMAIL, LEGAL_EFFECTIVE_DATE } from "@/constants/contact";
import {
  InstitutionalPageShell,
  InstitutionalSection,
  InstitutionalToc,
} from "@/features/institutional/components/InstitutionalPageShell";

const TOC = [
  { id: "dados-coletados", label: "Dados coletados" },
  { id: "finalidade", label: "Finalidade do tratamento" },
  { id: "cookies", label: "Cookies" },
  { id: "compartilhamento", label: "Compartilhamento de dados" },
  { id: "seguranca", label: "Segurança" },
  { id: "direitos", label: "Direitos do usuário" },
  { id: "encarregado", label: "Contato do encarregado" },
  { id: "alteracoes", label: "Alterações da política" },
] as const;

function PrivacidadePageView({ email = CONTACT_EMAIL }: { email?: string }) {
  return (
    <InstitutionalPageShell
      breadcrumbLabel="Privacidade"
      title="Política de Privacidade"
      description={`Esta Política descreve como o ${APP_NAME} coleta, utiliza, armazena e protege dados pessoais no âmbito da plataforma, em alinhamento aos princípios da Lei Geral de Proteção de Dados (LGPD).`}
    >
      <p className="text-small text-muted-foreground -mt-4">
        Vigência: {LEGAL_EFFECTIVE_DATE}
      </p>

      <InstitutionalToc items={[...TOC]} />

      <InstitutionalSection id="dados-coletados" title="1. Dados coletados">
        <p>Podemos coletar as seguintes categorias de dados:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium">Dados de cadastro:</span> nome,
            sobrenome, e-mail e telefone (quando informado)
          </li>
          <li>
            <span className="font-medium">Dados de perfil de vendedor:</span> nome
            da loja, nome de exibição, cidade, estado, descrição, WhatsApp e URL
            de foto
          </li>
          <li>
            <span className="font-medium">Dados de anúncios:</span> título,
            descrição, categoria, preço, imagens e informações de
            compatibilidade publicadas pelo usuário
          </li>
          <li>
            <span className="font-medium">Dados de uso e técnicos:</span>{" "}
            registros de acesso, endereço IP, tipo de navegador, páginas
            visitadas e interações necessárias à operação e segurança do serviço
          </li>
          <li>
            <span className="font-medium">Dados de comunicação:</span> mensagens
            enviadas aos canais oficiais de suporte
          </li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection
        id="finalidade"
        title="2. Finalidade do tratamento"
      >
        <p>Os dados são tratados para:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Criar e gerenciar contas de usuários</li>
          <li>Permitir publicação, edição e exibição de anúncios</li>
          <li>Exibir perfis públicos de lojas e facilitar o contato comercial</li>
          <li>Autenticar acessos e prevenir fraudes e abusos</li>
          <li>Prestação de suporte e atendimento institucional</li>
          <li>
            Cumprir obrigações legais e responder a requisições de autoridades
            competentes
          </li>
          <li>
            Melhorar a experiência, desempenho e segurança da plataforma
          </li>
        </ul>
        <p>
          A base legal pode incluir execução de contrato, legítimo interesse
          (quando cabível), cumprimento de obrigação legal e consentimento,
          conforme a hipótese concreta.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="cookies" title="3. Cookies">
        <p>
          Utilizamos cookies e tecnologias semelhantes essenciais ao
          funcionamento do site (por exemplo, manutenção de sessão e preferências
          básicas). Cookies analíticos ou de marketing, quando adotados, serão
          comunicados e, quando exigido, sujeitos a consentimento.
        </p>
        <p>
          Você pode gerenciar cookies nas configurações do navegador. A
          desativação de cookies essenciais pode comprometer o uso de algumas
          funcionalidades.
        </p>
      </InstitutionalSection>

      <InstitutionalSection
        id="compartilhamento"
        title="4. Compartilhamento de dados"
      >
        <p>
          Não vendemos dados pessoais. Podemos compartilhar informações nas
          seguintes hipóteses:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium">Publicação na plataforma:</span> dados
            de anúncios e informações públicas do perfil de loja ficam visíveis
            a visitantes
          </li>
          <li>
            <span className="font-medium">Prestadores de serviço:</span>{" "}
            provedores de infraestrutura, hospedagem, e-mail e monitoramento,
            sempre sob dever de confidencialidade e finalidade limitada
          </li>
          <li>
            <span className="font-medium">Obrigações legais:</span> quando
            necessário para cumprir lei, ordem judicial ou requisição de
            autoridade
          </li>
          <li>
            <span className="font-medium">Proteção de direitos:</span> para
            investigar fraudes, violações destes Termos ou riscos à segurança
          </li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection id="seguranca" title="5. Segurança">
        <p>
          Adotamos medidas técnicas e organizacionais razoáveis para proteger
          dados pessoais contra acessos não autorizados, perda, alteração ou
          divulgação indevida. Nenhum sistema é totalmente isento de riscos; os
          usuários também devem proteger suas senhas e dispositivos.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="direitos" title="6. Direitos do usuário">
        <p>
          Nos termos da LGPD, o titular pode solicitar, conforme o caso:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Confirmação da existência de tratamento</li>
          <li>Acesso aos dados</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
          <li>Portabilidade, quando aplicável</li>
          <li>Eliminação de dados tratados com consentimento</li>
          <li>Informação sobre compartilhamentos</li>
          <li>Revogação do consentimento, quando esta for a base legal</li>
        </ul>
        <p>
          Para exercer seus direitos, utilize o canal do encarregado indicado
          abaixo. Poderemos solicitar informações adicionais para confirmar a
          identidade do solicitante.
        </p>
      </InstitutionalSection>

      <InstitutionalSection
        id="encarregado"
        title="7. Contato do encarregado"
      >
        <p>
          Para questões relacionadas à privacidade e à proteção de dados
          pessoais no {APP_NAME}, entre em contato com o encarregado
          (DPO/canal de privacidade) pelo e-mail:
        </p>
        <p>
          <a
            href={`mailto:${email}`}
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            {email}
          </a>
        </p>
        <p className="text-small text-muted-foreground">
          Este endereço é um placeholder institucional e deverá ser confirmado
          ou substituído pelo contato oficial do encarregado antes da
          publicação em produção.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="alteracoes" title="8. Alterações da política">
        <p>
          Esta Política poderá ser atualizada para refletir mudanças legais,
          operacionais ou tecnológicas. A data de vigência será mantida
          visível nesta página. Recomendamos a consulta periódica deste
          documento.
        </p>
      </InstitutionalSection>
    </InstitutionalPageShell>
  );
}

export { PrivacidadePageView };
