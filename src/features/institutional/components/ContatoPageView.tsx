import { APP_NAME } from "@/constants/app";
import { CONTACT_EMAIL, CONTACT_HOURS } from "@/constants/contact";
import {
  InstitutionalPageShell,
  InstitutionalSection,
} from "@/features/institutional/components/InstitutionalPageShell";

type ContatoPageViewProps = {
  email?: string;
  phone?: string;
  whatsApp?: string;
  platformName?: string;
};

function ContatoPageView({
  email = CONTACT_EMAIL,
  phone,
  whatsApp,
  platformName = APP_NAME,
}: ContatoPageViewProps) {
  return (
    <InstitutionalPageShell
      breadcrumbLabel="Contato"
      title="Contato"
      description={`Fale com a equipe do ${platformName}. Estamos disponíveis para dúvidas sobre a plataforma, suporte e assuntos comerciais.`}
    >
      <InstitutionalSection id="canais" title="Canais de atendimento">
        <p>
          Por enquanto, o atendimento institucional é realizado por e-mail.
          Responderemos o mais breve possível dentro do horário comercial.
        </p>

        <dl className="border-border bg-surface mt-2 grid gap-4 rounded-xl border p-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <dt className="text-small font-medium">E-mail</dt>
            <dd>
              <a
                href={`mailto:${email}`}
                className="text-primary focus-visible:ring-ring rounded-sm font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
              >
                {email}
              </a>
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-small font-medium">Horário de atendimento</dt>
            <dd className="text-body">{CONTACT_HOURS}</dd>
          </div>
          {phone ? <div className="flex flex-col gap-1"><dt className="text-small font-medium">Telefone</dt><dd>{phone}</dd></div> : null}
          {whatsApp ? <div className="flex flex-col gap-1"><dt className="text-small font-medium">WhatsApp</dt><dd>{whatsApp}</dd></div> : null}
        </dl>
      </InstitutionalSection>

      <InstitutionalSection id="quando-usar" title="Quando nos procurar">
        <ul className="list-disc space-y-2 pl-5">
          <li>Dúvidas sobre cadastro, perfil de vendedor ou publicação de anúncios</li>
          <li>Problemas de acesso à conta ou uso da plataforma</li>
          <li>Assuntos comerciais, parcerias e imprensa</li>
          <li>Reportes de conteúdo inadequado ou conduta irregular</li>
        </ul>
        <p>
          Negociações sobre peças específicas (preço, frete, disponibilidade)
          devem ser feitas diretamente com o anunciante, preferencialmente pelos
          canais indicados no anúncio.
        </p>
      </InstitutionalSection>

      <section
        aria-labelledby="formulario-futuro"
        className="border-border rounded-xl border border-dashed p-5 sm:p-6"
      >
        <h2 id="formulario-futuro" className="text-h3">
          Formulário de contato
        </h2>
        <p className="text-small text-muted-foreground mt-2 leading-relaxed">
          Em breve você poderá enviar mensagens diretamente por esta página. Até
          lá, utilize o e-mail{" "}
          <a
            href={`mailto:${email}`}
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            {email}
          </a>{" "}
          para suporte e assuntos comerciais.
        </p>
      </section>
    </InstitutionalPageShell>
  );
}

export { ContatoPageView };
