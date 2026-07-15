"use client";

import Link from "next/link";

import { AnnounceButton } from "@/components/announce/AnnounceButton";
import { buttonVariants } from "@/components/ui/button";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import {
  InstitutionalPageShell,
  InstitutionalSection,
} from "@/features/institutional/components/InstitutionalPageShell";
import { cn } from "@/lib/utils";

function SobrePageView() {
  return (
    <InstitutionalPageShell
      breadcrumbLabel="Sobre"
      title={`Sobre o ${APP_NAME}`}
      description="O marketplace que conecta oficinas, autopeças e compradores a peças automotivas com mais confiança e praticidade."
    >
      <InstitutionalSection id="o-que-e" title={`O que é o ${APP_NAME}`}>
        <p>
          O {APP_NAME} é uma plataforma digital dedicada ao mercado de peças
          automotivas. Nosso objetivo é facilitar o encontro entre quem precisa
          de uma peça e quem tem essa peça para oferecer — com informações
          claras, contato direto e uma experiência simples de navegação.
        </p>
        <p>
          Aqui, vendedores e lojas publicam anúncios; compradores pesquisam por
          categoria, localização e compatibilidade; e o diálogo acontece de
          forma direta entre as partes.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="missao" title="Missão">
        <p>
          Tornar a compra e a venda de peças automotivas mais ágeis, transparentes
          e acessíveis, reduzindo a dificuldade de encontrar a peça certa no
          momento certo.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="como-funciona" title="Como funciona">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <span className="font-medium">Pesquise</span> — encontre peças por
            categoria, loja ou termos relevantes ao seu veículo.
          </li>
          <li>
            <span className="font-medium">Avalie</span> — compare anúncios,
            confira detalhes de compatibilidade e conheça a loja.
          </li>
          <li>
            <span className="font-medium">Entre em contato</span> — fale com o
            anunciante pelo WhatsApp ou pelos canais informados no anúncio.
          </li>
          <li>
            <span className="font-medium">Feche o negócio</span> — combine
            valores, frete e entrega diretamente com o vendedor.
          </li>
        </ol>
      </InstitutionalSection>

      <InstitutionalSection id="para-quem" title="Para quem foi criado">
        <p>
          O {APP_NAME} foi pensado para profissionais e consumidores do
          ecossistema automotivo:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Oficinas e mecânicos em busca de reposição rápida</li>
          <li>Autopeças e lojas que desejam ampliar o alcance dos anúncios</li>
          <li>Compradores particulares que precisam da peça certa com confiança</li>
          <li>Vendedores independentes com estoque de peças novas ou seminovas</li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection
        id="beneficios-compradores"
        title="Benefícios para compradores"
      >
        <ul className="list-disc space-y-2 pl-5">
          <li>Busca organizada por categorias e filtros úteis</li>
          <li>Detalhes de compatibilidade para reduzir compras erradas</li>
          <li>Acesso a lojas e vendedores da sua região e de outras localidades</li>
          <li>Contato direto com o anunciante, sem intermediários no diálogo</li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection
        id="beneficios-vendedores"
        title="Benefícios para vendedores"
      >
        <ul className="list-disc space-y-2 pl-5">
          <li>Publicação simples de anúncios com fotos e descrição</li>
          <li>Vitrine pública da sua loja no marketplace</li>
          <li>Alcance de compradores além do círculo local tradicional</li>
          <li>Painel para gerenciar perfil e peças anunciadas</li>
        </ul>
      </InstitutionalSection>

      <section
        aria-labelledby="cta-sobre"
        className="bg-primary text-primary-foreground rounded-xl px-6 py-8 text-center sm:px-8"
      >
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
          <h2
            id="cta-sobre"
            className="font-heading text-primary-foreground text-2xl font-semibold tracking-tight"
          >
            Pronto para começar?
          </h2>
          <p className="text-primary-foreground/85 text-sm leading-relaxed">
            Cadastre-se gratuitamente, complete seu perfil de vendedor e publique
            sua primeira peça no {APP_NAME}.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <AnnounceButton variant="secondary" size="lg">
              Anunciar Peça
            </AnnounceButton>
            <Link
              href={ROUTES.REGISTER}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground",
              )}
            >
              Criar conta
            </Link>
          </div>
        </div>
      </section>
    </InstitutionalPageShell>
  );
}

export { SobrePageView };
