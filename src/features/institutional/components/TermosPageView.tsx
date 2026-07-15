import { APP_NAME } from "@/constants/app";
import { CONTACT_EMAIL, LEGAL_EFFECTIVE_DATE } from "@/constants/contact";
import {
  InstitutionalPageShell,
  InstitutionalSection,
  InstitutionalToc,
} from "@/features/institutional/components/InstitutionalPageShell";

const TOC = [
  { id: "objeto", label: "Objeto" },
  { id: "cadastro", label: "Cadastro" },
  { id: "responsabilidades", label: "Responsabilidades dos usuários" },
  { id: "anuncios", label: "Publicação de anúncios" },
  { id: "condutas", label: "Condutas proibidas" },
  { id: "limitacao", label: "Limitação de responsabilidade" },
  { id: "propriedade", label: "Propriedade intelectual" },
  { id: "encerramento", label: "Encerramento de contas" },
  { id: "alteracoes", label: "Alterações dos termos" },
  { id: "legislacao", label: "Legislação aplicável" },
] as const;

function TermosPageView() {
  return (
    <InstitutionalPageShell
      breadcrumbLabel="Termos"
      title="Termos de Uso"
      description={`Estas condições regulam o acesso e o uso da plataforma ${APP_NAME}. Ao utilizar o site, você declara ter lido e concordado com estes Termos.`}
    >
      <p className="text-small text-muted-foreground -mt-4">
        Vigência: {LEGAL_EFFECTIVE_DATE}
      </p>

      <InstitutionalToc items={[...TOC]} />

      <InstitutionalSection id="objeto" title="1. Objeto">
        <p>
          O {APP_NAME} é um marketplace digital que permite a publicação e a
          consulta de anúncios de peças automotivas, além do contato entre
          compradores e vendedores. A plataforma atua como ambiente de
          intermediação tecnológica e não é parte nas negociações, vendas,
          pagamentos, entregas ou garantias firmadas entre os usuários.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="cadastro" title="2. Cadastro">
        <p>
          Para utilizar determinadas funcionalidades, o usuário deverá criar uma
          conta com informações verdadeiras, completas e atualizadas. É de
          responsabilidade do usuário manter a confidencialidade de suas
          credenciais de acesso.
        </p>
        <p>
          Vendedores que desejarem publicar anúncios deverão completar o perfil
          de vendedor com dados da loja ou identificação comercial, sujeito às
          regras da plataforma.
        </p>
        <p>
          O {APP_NAME} poderá recusar, suspender ou cancelar cadastros que
          apresentem dados inconsistentes, fraudulentos ou em desacordo com estes
          Termos.
        </p>
      </InstitutionalSection>

      <InstitutionalSection
        id="responsabilidades"
        title="3. Responsabilidades dos usuários"
      >
        <p>Os usuários comprometem-se a:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Utilizar a plataforma de forma ética e em conformidade com a lei</li>
          <li>Fornecer informações corretas em cadastros e anúncios</li>
          <li>
            Conduzir tratativas comerciais com boa-fé, clareza e respeito
          </li>
          <li>
            Verificar por conta própria a adequação, autenticidade e condição das
            peças antes de concluir qualquer negócio
          </li>
          <li>
            Não utilizar a plataforma para fins ilícitos, abusivos ou que
            prejudiquem terceiros
          </li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection id="anuncios" title="4. Publicação de anúncios">
        <p>
          A publicação de anúncios é de responsabilidade exclusiva do vendedor.
          O conteúdo (títulos, descrições, preços, fotos, compatibilidade e
          demais dados) deve ser preciso, lícito e não enganoso.
        </p>
        <p>
          O {APP_NAME} poderá moderar, ocultar ou remover anúncios que violem
          estes Termos, a legislação vigente ou políticas internas de uso,
          inclusive aqueles que apresentem conteúdo ofensivo, ilegal,
          enganoso ou inadequado ao contexto automotivo.
        </p>
        <p>
          A disponibilidade, o preço e as condições de entrega/retirada são
          definidos pelo anunciante e devem ser confirmados diretamente com ele.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="condutas" title="5. Condutas proibidas">
        <p>É vedado, entre outras condutas:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Publicar peças ilegais, adulteradas ou de origem ilícita</li>
          <li>Utilizar imagens ou textos de terceiros sem autorização</li>
          <li>Praticar fraude, phishing ou engenharia social</li>
          <li>Assediar, ameaçar ou discriminar outros usuários</li>
          <li>
            Tentar obter acesso não autorizado a contas, dados ou sistemas da
            plataforma
          </li>
          <li>
            Usar robôs, scrapers ou meios automatizados que prejudiquem o
            funcionamento do serviço, salvo autorização expressa
          </li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection
        id="limitacao"
        title="6. Limitação de responsabilidade"
      >
        <p>
          O {APP_NAME} não se responsabiliza por prejuízos decorrentes de
          negócios celebrados entre usuários, incluindo, mas não se limitando a:
          qualidade da peça, compatibilidade, atrasos, extravios, pagamentos,
          estornos, garantia do fabricante ou do vendedor, e descumprimento
          contratual entre as partes.
        </p>
        <p>
          A plataforma é disponibilizada “como está”, podendo ocorrer
          indisponibilidades, manutenção ou falhas técnicas. Sem prejuízo dos
          direitos do consumidor quando aplicáveis, o {APP_NAME} busca manter o
          serviço estável e seguro, sem garantir funcionamento ininterrupto.
        </p>
      </InstitutionalSection>

      <InstitutionalSection
        id="propriedade"
        title="7. Propriedade intelectual"
      >
        <p>
          Marcas, logotipos, layout, textos institucionais, código e demais
          elementos da plataforma são de titularidade do {APP_NAME} ou de seus
          licenciadores. É proibida a reprodução sem autorização.
        </p>
        <p>
          O conteúdo enviado pelos usuários (como fotos e descrições de anúncios)
          permanece sob responsabilidade de quem o publicou. Ao publicar, o
          usuário concede ao {APP_NAME} licença não exclusiva para exibir esse
          conteúdo na plataforma e em canais de divulgação relacionados ao
          serviço.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="encerramento" title="8. Encerramento de contas">
        <p>
          O usuário pode solicitar o encerramento de sua conta pelos canais
          oficiais de contato. O {APP_NAME} poderá suspender ou encerrar contas
          em caso de violação destes Termos, suspeita de fraude, ordem judicial
          ou risco à segurança da plataforma e de outros usuários.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="alteracoes" title="9. Alterações dos termos">
        <p>
          Estes Termos poderão ser atualizados periodicamente. A data de vigência
          será indicada nesta página. O uso continuado da plataforma após a
          publicação de alterações implica ciência das novas condições, quando
          permitido pela legislação aplicável.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="legislacao" title="10. Legislação aplicável">
        <p>
          Estes Termos são regidos pelas leis da República Federativa do Brasil.
          Fica eleito o foro da comarca do domicílio do usuário, quando for
          consumidor, ou outro foro competente conforme a legislação vigente,
          para dirimir controvérsias oriundas destes Termos.
        </p>
        <p>
          Dúvidas sobre estes Termos podem ser enviadas para{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </InstitutionalSection>
    </InstitutionalPageShell>
  );
}

export { TermosPageView };
