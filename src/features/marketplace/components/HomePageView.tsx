"use client";

import Link from "next/link";
import { createElement } from "react";
import {
  Handshake,
  MessageCircle,
  Package,
  Search,
  Store,
  type LucideIcon,
} from "lucide-react";

import { AnnounceButton } from "@/components/announce/AnnounceButton";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { APP_DESCRIPTION } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import {
  AdvertisementGrid,
  AdvertisementGridSkeleton,
  CategoryGrid,
  CategoryGridSkeleton,
  SearchInput,
  SellerGrid,
  StoresGridSkeleton,
} from "@/features/marketplace";
import { useAdvertisements } from "@/hooks/api/useAdvertisements";
import { useCategories } from "@/hooks/api/useCategories";
import { useStores } from "@/hooks/api/useStores";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { mapCategoriesWithAdvertisementCounts } from "@/mappers/category.mapper";
import { cn } from "@/lib/utils";

const HOME_RECENT_ADS_LIMIT = 6;
const HOME_FEATURED_STORES_LIMIT = 4;

const HOW_IT_WORKS: {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    step: "1",
    title: "Pesquise",
    description: "Encontre a peça certa por categoria, marca ou código.",
    icon: Search,
  },
  {
    step: "2",
    title: "Entre em contato",
    description: "Fale diretamente com o anunciante ou a loja.",
    icon: MessageCircle,
  },
  {
    step: "3",
    title: "Feche o negócio",
    description: "Combine a compra com segurança e praticidade.",
    icon: Handshake,
  },
];

function SectionHeading({
  id,
  title,
  actionLabel,
  actionHref,
}: {
  id: string;
  title: string;
  actionLabel: string;
  actionHref?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <h2 id={id} className="text-h2">
        {title}
      </h2>
      {actionHref ? (
        <Link
          href={actionHref}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-fit",
          )}
        >
          {actionLabel}
        </Link>
      ) : (
        <Button type="button" variant="outline" size="sm" className="w-fit">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/**
 * Home pública — hero/CTA/como funciona estáticos;
 * categorias, anúncios e lojas via hooks existentes (cache TanStack Query).
 */
function HomePageView() {
  const categoriesQuery = useCategories();
  const advertisementsQuery = useAdvertisements({ page: 1 });
  const storesQuery = useStores();

  const marketplaceItems = advertisementsQuery.data?.items;
  const categories = !categoriesQuery.data
    ? []
    : !marketplaceItems
      ? categoriesQuery.data
      : mapCategoriesWithAdvertisementCounts(
          categoriesQuery.data,
          marketplaceItems.map((item) => item.category),
        );

  const recentAdvertisements = (marketplaceItems ?? []).slice(
    0,
    HOME_RECENT_ADS_LIMIT,
  );

  const featuredStores = (storesQuery.data ?? []).slice(
    0,
    HOME_FEATURED_STORES_LIMIT,
  );

  return (
    <div className="flex flex-col gap-14 sm:gap-16 md:gap-20">
      <section
        aria-labelledby="hero-heading"
        className="flex flex-col items-center gap-6 pt-2 text-center sm:pt-4 md:pt-6"
      >
        <div className="flex max-w-2xl flex-col gap-3">
          <h1 id="hero-heading" className="text-display">
            Peças automotivas com confiança
          </h1>
          <p className="text-body text-muted-foreground">{APP_DESCRIPTION}</p>
        </div>

        <div className="w-full max-w-xl">
          <SearchInput id="home-search" />
        </div>

        <div className="flex flex-col items-center gap-3">
          <AnnounceButton variant="primary" size="lg" />
          <p className="text-small">
            Milhares de peças automotivas anunciadas em um só lugar.
          </p>
        </div>
      </section>

      <section aria-labelledby="categories-heading">
        <SectionHeading
          id="categories-heading"
          title="Categorias"
          actionLabel="Ver todas as categorias"
          actionHref={ROUTES.CATEGORIES}
        />

        {categoriesQuery.isLoading ? <CategoryGridSkeleton /> : null}

        {categoriesQuery.isError ? (
          <ErrorMessage
            title="Não foi possível carregar as categorias"
            message={getFriendlyErrorMessage(categoriesQuery.error)}
          />
        ) : null}

        {!categoriesQuery.isLoading &&
        !categoriesQuery.isError &&
        categories.length > 0 ? (
          <CategoryGrid categories={categories} />
        ) : null}

        {!categoriesQuery.isLoading &&
        !categoriesQuery.isError &&
        categories.length === 0 ? (
          <EmptyState
            title="Nenhuma categoria disponível"
            description="As categorias aparecerão aqui em breve."
          />
        ) : null}
      </section>

      <section aria-labelledby="ads-heading">
        <SectionHeading
          id="ads-heading"
          title="Anúncios recentes"
          actionLabel="Ver todos os anúncios"
          actionHref={ROUTES.ADVERTISEMENTS}
        />

        {advertisementsQuery.isLoading ? <AdvertisementGridSkeleton /> : null}

        {advertisementsQuery.isError ? (
          <ErrorMessage
            title="Não foi possível carregar os anúncios"
            message={getFriendlyErrorMessage(advertisementsQuery.error)}
          />
        ) : null}

        {!advertisementsQuery.isLoading &&
        !advertisementsQuery.isError &&
        recentAdvertisements.length > 0 ? (
          <AdvertisementGrid advertisements={recentAdvertisements} />
        ) : null}

        {!advertisementsQuery.isLoading &&
        !advertisementsQuery.isError &&
        recentAdvertisements.length === 0 ? (
          <EmptyState
            title="Nenhum anúncio publicado"
            description="Não há anúncios disponíveis no momento. Volte em breve."
            icon={<Package aria-hidden />}
            action={
              <Link
                href={ROUTES.ADVERTISEMENTS}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Ver anúncios
              </Link>
            }
          />
        ) : null}
      </section>

      <section aria-labelledby="sellers-heading">
        <SectionHeading
          id="sellers-heading"
          title="Lojas em destaque"
          actionLabel="Ver todas as lojas"
          actionHref={ROUTES.STORES}
        />

        {storesQuery.isLoading ? <StoresGridSkeleton /> : null}

        {storesQuery.isError ? (
          <ErrorMessage
            title="Não foi possível carregar as lojas"
            message={getFriendlyErrorMessage(storesQuery.error)}
          />
        ) : null}

        {!storesQuery.isLoading &&
        !storesQuery.isError &&
        featuredStores.length > 0 ? (
          <SellerGrid sellers={featuredStores} />
        ) : null}

        {!storesQuery.isLoading &&
        !storesQuery.isError &&
        featuredStores.length === 0 ? (
          <EmptyState
            title="Nenhuma loja em destaque"
            description="As lojas aparecem aqui conforme novos vendedores anunciam."
            icon={<Store aria-hidden />}
            action={
              <Link
                href={ROUTES.STORES}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Ver lojas
              </Link>
            }
          />
        ) : null}
      </section>

      <section aria-labelledby="how-heading">
        <h2 id="how-heading" className="text-h2 mb-6 text-center sm:mb-8">
          Como funciona
        </h2>
        <ol className="grid list-none grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
          {HOW_IT_WORKS.map(({ step, title, description, icon }) => (
            <li
              key={step}
              className="bg-surface border-border flex flex-col items-center gap-3 rounded-xl border p-6 text-center shadow-xs"
            >
              <div
                className="bg-secondary text-secondary-foreground flex size-12 items-center justify-center rounded-lg"
                aria-hidden
              >
                {createElement(icon, { className: "size-6" })}
              </div>
              <p className="text-small font-medium">Passo {step}</p>
              <h3 className="text-h3">{title}</h3>
              <p className="text-small">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="cta-heading"
        className="bg-primary text-primary-foreground rounded-xl px-6 py-10 text-center sm:px-10 sm:py-12"
      >
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
          <h2
            id="cta-heading"
            className="font-heading text-primary-foreground text-2xl font-semibold tracking-tight"
          >
            Tem peças para vender?
          </h2>
          <p className="text-primary-foreground/85 text-sm leading-relaxed">
            Anuncie no ClubePeças e alcance oficinas e compradores da sua
            região.
          </p>
          <AnnounceButton variant="secondary" size="lg" className="mt-1">
            Começar agora
          </AnnounceButton>
        </div>
      </section>
    </div>
  );
}

export { HomePageView };
