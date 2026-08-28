"use client";

import { PackageSearch } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { ListingPaginationControls } from "@/components/navigation/ListingPaginationControls";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";
import { AdvertisementGrid } from "@/features/marketplace";
import { AdvertisementGridSkeleton } from "@/features/marketplace/components/AdvertisementGridSkeleton";
import { AdvertisementsToolbar } from "@/features/marketplace/components/AdvertisementsToolbar";
import { FilterSidebar } from "@/features/marketplace/components/FilterSidebar";
import { useAdvertisements } from "@/hooks/api/useAdvertisements";
import { useCategories } from "@/hooks/api/useCategories";
import { useCities } from "@/hooks/api/useCities";
import { useVehicleBrands } from "@/hooks/api/useVehicleBrands";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { formatCityLabel } from "@/mappers/city.mapper";
import {
  buildAdvertisementsHref,
  clampMarketplaceListingPage,
  hasActiveMarketplaceListingFilters,
  isRandomMarketplaceSort,
  MARKETPLACE_DEFAULT_SORT,
  MARKETPLACE_UNFILTERED_MAX_PAGES,
  parseMarketplaceListingFilters,
  toMarketplaceApiParams,
  type MarketplaceListingFilters,
} from "@/utils/marketplace-search";
import {
  createListingShuffleSeed,
  PUBLIC_LISTING_DEFAULT_PAGE_SIZE,
} from "@/utils/public-listing-pagination";

/**
 * Conteúdo da listagem pública /anuncios.
 * Lê filtros da URL e consulta GET /api/v1/marketplace.
 */
function AdvertisementsPageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseMarketplaceListingFilters(searchParams);
  const [shuffleSeed, setShuffleSeed] = useState(() => createListingShuffleSeed());
  const page = clampMarketplaceListingPage(filters, filters.page ?? 1);
  const pageSize = filters.pageSize ?? PUBLIC_LISTING_DEFAULT_PAGE_SIZE;
  const sort = filters.sort ?? MARKETPLACE_DEFAULT_SORT;
  const isRandomSort = isRandomMarketplaceSort(sort);
  const hasActiveFilters = hasActiveMarketplaceListingFilters(filters);
  const effectiveShuffleSeed = isRandomSort
    ? page === 1
      ? shuffleSeed
      : (filters.shuffleSeed ?? shuffleSeed)
    : undefined;

  useEffect(() => {
    if (page === 1 && filters.shuffleSeed) {
      router.replace(
        buildAdvertisementsHref({ ...filters, shuffleSeed: undefined }),
      );
    }
  }, [filters, page, router]);

  useEffect(() => {
    const rawPage = filters.page ?? 1;
    if (!hasActiveFilters && rawPage > MARKETPLACE_UNFILTERED_MAX_PAGES) {
      router.replace(
        buildAdvertisementsHref({
          ...filters,
          page: MARKETPLACE_UNFILTERED_MAX_PAGES,
        }),
      );
    }
  }, [filters, hasActiveFilters, router]);

  const advertisementsQuery = useAdvertisements({
    ...toMarketplaceApiParams(filters),
    ...(isRandomSort && effectiveShuffleSeed
      ? { shuffleSeed: effectiveShuffleSeed }
      : {}),
    page,
    pageSize,
  });
  const categoriesQuery = useCategories();
  const citiesQuery = useCities();
  const vehicleBrandsQuery = useVehicleBrands();

  const advertisements = advertisementsQuery.data?.items ?? [];
  const total = advertisementsQuery.data?.total ?? 0;
  const currentPage = advertisementsQuery.data?.page ?? page;
  const totalPages = advertisementsQuery.data?.totalPages ?? 1;

  const totalLabel = filters.q
    ? total === 1
      ? `1 resultado para “${filters.q}”`
      : `${total} resultados para “${filters.q}”`
    : total === 1
      ? "1 anúncio encontrado"
      : `${total} anúncios encontrados`;

  const filterCategories = [
    { id: "all", label: "Todas" },
    ...(categoriesQuery.data ?? [])
      .filter((category) => category.parentId == null)
      .map((category) => ({
        id: String(category.id),
        label: category.name,
      })),
  ];

  const filterBrands = [
    { id: "all", label: "Todas" },
    ...(vehicleBrandsQuery.data ?? []).map((brand) => ({
      id: brand.slug,
      label: brand.name,
    })),
  ];

  const filterCities = [
    { id: "all", label: "Todas" },
    ...(citiesQuery.data ?? []).map((city) => ({
      id: city.slug,
      label: formatCityLabel(city),
    })),
  ];

  const applyFilters = useCallback(
    (next: MarketplaceListingFilters) => {
      if (isRandomMarketplaceSort(filters.sort)) {
        setShuffleSeed(createListingShuffleSeed());
      }

      router.push(
        buildAdvertisementsHref({
          ...next,
          q: filters.q,
          sort: filters.sort,
          page: 1,
        }),
      );
    },
    [filters.q, filters.sort, router],
  );

  const applySort = useCallback(
    (nextSort: string) => {
      if (nextSort === MARKETPLACE_DEFAULT_SORT) {
        setShuffleSeed(createListingShuffleSeed());
      }

      router.push(
        buildAdvertisementsHref({
          ...filters,
          sort: nextSort,
          page: 1,
        }),
      );
    },
    [filters, router],
  );

  const goToPage = useCallback(
    (nextPage: number) => {
      const clampedPage = clampMarketplaceListingPage(filters, nextPage);

      router.push(
        buildAdvertisementsHref({
          ...filters,
          page: clampedPage,
          shuffleSeed:
            isRandomMarketplaceSort(filters.sort) && clampedPage > 1
              ? shuffleSeed
              : undefined,
        }),
      );
    },
    [filters, router, shuffleSeed],
  );

  const changePageSize = useCallback(
    (nextPageSize: number) => {
      if (isRandomMarketplaceSort(filters.sort)) {
        setShuffleSeed(createListingShuffleSeed());
      }

      router.push(
        buildAdvertisementsHref({
          ...filters,
          pageSize: nextPageSize,
          page: 1,
        }),
      );
    },
    [filters, router],
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Breadcrumb
          items={[{ label: "Home", href: ROUTES.HOME }, { label: "Anúncios" }]}
        />
        <div className="flex flex-col gap-1.5">
          <h1 className="text-h1">Anúncios</h1>
          <p className="text-body text-muted-foreground">
            {advertisementsQuery.isLoading ? "Carregando anúncios…" : totalLabel}
          </p>
        </div>
      </header>

      <AdvertisementsToolbar
        searchQuery={filters.q ?? ""}
        sort={filters.sort ?? MARKETPLACE_DEFAULT_SORT}
        onSortChange={applySort}
        filterValues={filters}
        filterCategories={filterCategories}
        filterBrands={filterBrands}
        filterCities={filterCities}
        onApplyFilters={applyFilters}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="hidden w-64 shrink-0 lg:block xl:w-72">
          <FilterSidebar
            categories={filterCategories}
            brands={filterBrands}
            cities={filterCities}
            values={filters}
            onApply={applyFilters}
          />
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
                title={
                  filters.q
                    ? `Nenhum anúncio encontrado para “${filters.q}”.`
                    : hasActiveFilters
                      ? "Nenhum anúncio encontrado para os filtros selecionados."
                      : "Nenhum anúncio encontrado"
                }
                description={
                  hasActiveFilters
                    ? "Tente outros termos, categorias ou localização."
                    : "Ainda não há peças publicadas no marketplace."
                }
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
            <ListingPaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={goToPage}
              onPageSizeChange={changePageSize}
              pageSizeSelectId="ads-page-size"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { AdvertisementsPageView };
