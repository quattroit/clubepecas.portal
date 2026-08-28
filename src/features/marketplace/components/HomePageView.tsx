"use client";

import Image from "next/image";
import Link from "next/link";
import { createElement, useMemo } from "react";
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
import { APP_DESCRIPTION, APP_HERO_BG_SRC } from "@/constants/app";
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
import { HeroStats } from "@/features/marketplace/components/HeroStats";
import { useAdvertisements } from "@/hooks/api/useAdvertisements";
import { useCategories } from "@/hooks/api/useCategories";
import { useStores } from "@/hooks/api/useStores";
import { usePlatformSettings } from "@/hooks/api/usePlatformSettings";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { createListingShuffleSeed } from "@/utils/public-listing-pagination";

const HOME_RECENT_ADS_LIMIT = 6;
const HOME_FEATURED_STORES_LIMIT = 3;
const HOME_CATEGORIES_LIMIT = 4;

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
    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <h2 id={id} className="text-h2">
        {title}
      </h2>
      {actionHref ? (
        <Link
          href={actionHref}
          className={cn(
            buttonVariants({ variant: "primary", size: "sm" }),
            "w-fit",
          )}
        >
          {actionLabel}
        </Link>
      ) : (
        <Button type="button" variant="primary" size="sm" className="w-fit">
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
  const homeStoreShuffleSeed = useMemo(() => createListingShuffleSeed(), []);
  const advertisementsQuery = useAdvertisements({
    page: 1,
    pageSize: HOME_RECENT_ADS_LIMIT,
    sort: "recent",
  });
  const storesQuery = useStores({
    page: 1,
    pageSize: 30,
    sort: "random",
    shuffleSeed: homeStoreShuffleSeed,
  });
  const platformSettingsQuery = usePlatformSettings();
  const platformDescription =
    platformSettingsQuery.data?.platformDescription ?? APP_DESCRIPTION;

  const marketplaceItems = advertisementsQuery.data?.items;
  const allCategories = categoriesQuery.data ?? [];
  const categories = allCategories
    .filter((category) => category.parentId == null)
    .map((root) => {
      const childrenAds = allCategories
        .filter((category) => category.parentId === root.id)
        .reduce((sum, category) => sum + category.advertisementCount, 0);
      return {
        ...root,
        advertisementCount: root.advertisementCount + childrenAds,
      };
    })
    .sort((a, b) => b.advertisementCount - a.advertisementCount)
    .slice(0, HOME_CATEGORIES_LIMIT);

  const recentAdvertisements = (marketplaceItems ?? []).slice(
    0,
    HOME_RECENT_ADS_LIMIT,
  );

  const featuredStores = useMemo(
    () =>
      (storesQuery.data?.items ?? []).slice(0, HOME_FEATURED_STORES_LIMIT),
    [storesQuery.data?.items],
  );

  return (
    <div className="flex flex-col gap-20 sm:gap-24 md:gap-28">
      <section
        aria-labelledby="hero-heading"
        className="surface-brand relative overflow-hidden rounded-3xl shadow-lg"
      >
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-[58%]"
          aria-hidden
        >
          <Image
            src={APP_HERO_BG_SRC}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover object-center opacity-40 md:opacity-55"
          />
          <div className="from-brand via-brand/85 absolute inset-0 bg-linear-to-r to-transparent md:via-brand/70" />
          <div className="from-brand absolute inset-x-0 bottom-0 h-24 bg-linear-to-t to-transparent md:hidden" />
        </div>

        <div className="relative z-10 grid gap-10 px-6 py-12 sm:px-10 sm:py-14 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center md:gap-8 md:px-12 md:py-16 lg:px-14 lg:py-20">
          <div className="flex max-w-xl flex-col items-start gap-6 text-left sm:gap-7">
            <div className="flex flex-col gap-4">
              <h1 id="hero-heading" className="text-display">
                Peças automotivas
                <br />
                com <span className="text-primary">confiança</span>
              </h1>
              <p className="text-body max-w-md">{platformDescription}</p>
            </div>

            <div className="relative z-20 w-full max-w-lg">
              <SearchInput id="home-search" tone="hero" />
            </div>

            <AnnounceButton variant="primary" size="lg" />
          </div>

          <div className="pointer-events-none hidden min-h-48 md:block" aria-hidden />
        </div>

        <div className="border-brand-border relative z-10 border-t bg-brand/40 backdrop-blur-[2px]">
          <HeroStats />
        </div>
      </section>

      <section aria-labelledby="categories-heading">
        <SectionHeading
          id="categories-heading"
          title="Categorias"
          actionLabel="Ver todas as categorias"
          actionHref={ROUTES.CATEGORIES}
        />

        {categoriesQuery.isLoading ? (
          <CategoryGridSkeleton count={HOME_CATEGORIES_LIMIT} />
        ) : null}

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
            icon={<Package aria-hidden />}
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
        <h2 id="how-heading" className="text-h2 mb-10 text-center sm:mb-12">
          Como funciona
        </h2>
        <ol className="grid list-none grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-7">
          {HOW_IT_WORKS.map(({ step, title, description, icon }) => (
            <li
              key={step}
              className="card-interactive bg-card flex flex-col items-center gap-4 rounded-3xl p-8 text-center sm:p-9"
            >
              <div
                className="bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full"
                aria-hidden
              >
                {createElement(icon, { className: "size-7" })}
              </div>
              <p className="text-primary text-xs font-semibold tracking-wider uppercase">
                Passo {step}
              </p>
              <h3 className="text-h3">{title}</h3>
              <p className="text-small">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="cta-heading"
        className="surface-brand overflow-hidden rounded-3xl shadow-md"
      >
        <div className="flex flex-col items-center gap-7 px-6 py-14 text-center sm:flex-row sm:justify-between sm:px-12 sm:py-16 sm:text-left">
          <div className="max-w-lg space-y-3">
            <h2 id="cta-heading" className="text-h2">
              Tem peças para vender?
            </h2>
            <p className="text-body">
              Anuncie no ClubePeças e alcance oficinas e profissionais da sua
              região.
            </p>
          </div>
          <AnnounceButton variant="primary" size="lg" className="shrink-0">
            Começar agora
          </AnnounceButton>
        </div>
      </section>
    </div>
  );
}

export { HomePageView };
