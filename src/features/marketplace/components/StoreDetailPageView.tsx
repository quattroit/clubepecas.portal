"use client";

import { useParams } from "next/navigation";

import { Package } from "lucide-react";

import { AnnounceButton } from "@/components/announce/AnnounceButton";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { NotFound } from "@/components/feedback/NotFound";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";
import {
  AdvertisementGrid,
  StoreDescription,
  StoreHeader,
  StoreStats,
} from "@/features/marketplace";
import { StoreDetailSkeleton } from "@/features/marketplace/components/StoreDetailSkeleton";
import { useTrackStoreView } from "@/hooks/analytics/useTrackPageViews";
import { useStore } from "@/hooks/api/useStore";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { NotFoundError } from "@/lib/errors";

/**
 * Detalhe público /lojas/[slug] — mesma UI, dados da API.
 */
function StoreDetailPageView() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const storeQuery = useStore(slug ?? "");
  useTrackStoreView(storeQuery.isSuccess && storeQuery.data ? slug : null);

  if (storeQuery.isLoading) {
    return <StoreDetailSkeleton />;
  }

  if (storeQuery.isError) {
    if (storeQuery.error instanceof NotFoundError) {
      return (
        <NotFound
          title="Loja não encontrada"
          description="Esta loja não existe ou não está mais disponível."
          homeHref={ROUTES.STORES}
        />
      );
    }

    return (
      <ErrorMessage
        title="Não foi possível carregar a loja"
        message={getFriendlyErrorMessage(storeQuery.error)}
      />
    );
  }

  if (!storeQuery.data) {
    return (
      <NotFound
        title="Loja não encontrada"
        description="Esta loja não existe ou não está mais disponível."
        homeHref={ROUTES.STORES}
      />
    );
  }

  const { seller, advertisements, categoriesCount } = storeQuery.data;

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <Breadcrumb
        items={[
          { label: "Home", href: ROUTES.HOME },
          { label: "Lojas", href: ROUTES.STORES },
          { label: seller.name },
        ]}
      />

      <StoreHeader seller={seller} />

      <StoreDescription description={seller.description} />

      <StoreStats
        advertisementCount={seller.advertisementCount}
        categoriesCount={categoriesCount}
        city={seller.city}
        registeredAt={seller.registeredAt}
      />

      <section
        aria-labelledby="store-ads-heading"
        className="flex flex-col gap-4"
      >
        <h2 id="store-ads-heading" className="text-h2">
          Anúncios desta loja
        </h2>
        {advertisements.length > 0 ? (
          <AdvertisementGrid advertisements={advertisements} />
        ) : (
          <EmptyState
            title="Nenhum anúncio nesta loja"
            description="Esta loja ainda não publicou anúncios."
            icon={<Package aria-hidden />}
          />
        )}
      </section>

      <section
        aria-labelledby="store-cta-heading"
        className="surface-brand overflow-hidden rounded-3xl shadow-md"
      >
        <div className="flex flex-col items-center gap-7 px-6 py-14 text-center sm:flex-row sm:justify-between sm:px-12 sm:py-16 sm:text-left">
          <div className="max-w-lg space-y-3">
            <h2 id="store-cta-heading" className="text-h2">
              Tem peças para vender?
            </h2>
            <p className="text-body">
              Crie sua loja no ClubePeças e anuncie para oficinas e profissionais da região.
            </p>
          </div>
          <AnnounceButton variant="primary" size="lg" className="shrink-0">
            Anunciar peça
          </AnnounceButton>
        </div>
      </section>
    </div>
  );
}

export { StoreDetailPageView };
