"use client";

import { PackageSearch } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { Pagination } from "@/components/navigation/Pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";
import { AdvertisementGrid } from "@/features/marketplace";
import { AdvertisementGridSkeleton } from "@/features/marketplace/components/AdvertisementGridSkeleton";
import { AdvertisementsToolbar } from "@/features/marketplace/components/AdvertisementsToolbar";
import { FilterSidebar } from "@/features/marketplace/components/FilterSidebar";
import { useAdvertisements } from "@/hooks/api/useAdvertisements";
import { useCategories } from "@/hooks/api/useCategories";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

/**
 * Conteúdo da listagem pública /anuncios.
 * Mesma UI de antes — origem dos dados: API marketplace.
 */
function AdvertisementsPageView() {
  const advertisementsQuery = useAdvertisements({ page: 1 });
  const categoriesQuery = useCategories();

  const advertisements = advertisementsQuery.data?.items ?? [];
  const total = advertisementsQuery.data?.total ?? 0;
  const currentPage = advertisementsQuery.data?.page ?? 1;
  const totalPages = advertisementsQuery.data?.totalPages ?? 1;

  const totalLabel =
    total === 1 ? "1 anúncio encontrado" : `${total} anúncios encontrados`;

  const filterCategories = [
    { id: "all", label: "Todas" },
    ...(categoriesQuery.data ?? []).map((category) => ({
      id: category.id,
      label: category.name,
    })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Breadcrumb
          items={[{ label: "Home", href: ROUTES.HOME }, { label: "Anúncios" }]}
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-h1">Anúncios</h1>
          <p className="text-small">
            {advertisementsQuery.isLoading ? "Carregando anúncios…" : totalLabel}
          </p>
        </div>
      </header>

      <AdvertisementsToolbar />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="hidden w-64 shrink-0 lg:block xl:w-72">
          <FilterSidebar categories={filterCategories} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <section aria-labelledby="ads-results-heading">
            <h2 id="ads-results-heading" className="sr-only">
              Resultados
            </h2>

            {advertisementsQuery.isLoading ? (
              <AdvertisementGridSkeleton />
            ) : null}

            {advertisementsQuery.isError ? (
              <ErrorMessage
                title="Não foi possível carregar os anúncios"
                message={getFriendlyErrorMessage(advertisementsQuery.error)}
              />
            ) : null}

            {!advertisementsQuery.isLoading &&
            !advertisementsQuery.isError &&
            advertisements.length === 0 ? (
              <EmptyState
                title="Nenhum anúncio encontrado"
                description="Ainda não há peças publicadas no marketplace."
                icon={<PackageSearch aria-hidden />}
              />
            ) : null}

            {!advertisementsQuery.isLoading &&
            !advertisementsQuery.isError &&
            advertisements.length > 0 ? (
              <AdvertisementGrid advertisements={advertisements} />
            ) : null}
          </section>

          {!advertisementsQuery.isLoading &&
          !advertisementsQuery.isError &&
          advertisements.length > 0 ? (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { AdvertisementsPageView };
