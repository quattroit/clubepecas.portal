"use client";

import { Store } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { ListingPaginationControls } from "@/components/navigation/ListingPaginationControls";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";
import { SellerGrid } from "@/features/marketplace";
import { StoresGridSkeleton } from "@/features/marketplace/components/StoresGridSkeleton";
import { StoresRegionFilter } from "@/features/marketplace/components/StoresRegionFilter";
import { useCities } from "@/hooks/api/useCities";
import { useStores } from "@/hooks/api/useStores";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import {
  createListingShuffleSeed,
  PUBLIC_LISTING_DEFAULT_PAGE_SIZE,
} from "@/utils/public-listing-pagination";
import {
  buildStoresHref,
  clampStoresListingPage,
  hasActiveStoresListingFilters,
  isRandomStoresSort,
  parseStoresListingFilters,
  STORES_DEFAULT_SORT,
  STORES_UNFILTERED_MAX_PAGES,
  toStoresApiParams,
  type StoresListingFilters,
} from "@/utils/stores-search";

/**
 * Listagem pública /lojas — mesma UI, dados da API.
 */
function StoresPageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseStoresListingFilters(searchParams);
  const [shuffleSeed, setShuffleSeed] = useState(() => createListingShuffleSeed());
  const page = clampStoresListingPage(filters, filters.page ?? 1);
  const pageSize = filters.pageSize ?? PUBLIC_LISTING_DEFAULT_PAGE_SIZE;
  const sort = filters.sort ?? STORES_DEFAULT_SORT;
  const isRandomSort = isRandomStoresSort(sort);
  const hasActiveFilters = hasActiveStoresListingFilters(filters);
  const effectiveShuffleSeed = isRandomSort
    ? page === 1
      ? shuffleSeed
      : (filters.shuffleSeed ?? shuffleSeed)
    : undefined;

  useEffect(() => {
    if (page === 1 && filters.shuffleSeed) {
      router.replace(buildStoresHref({ ...filters, shuffleSeed: undefined }));
    }
  }, [filters, page, router]);

  useEffect(() => {
    const rawPage = filters.page ?? 1;
    if (!hasActiveFilters && rawPage > STORES_UNFILTERED_MAX_PAGES) {
      router.replace(
        buildStoresHref({
          ...filters,
          page: STORES_UNFILTERED_MAX_PAGES,
        }),
      );
    }
  }, [filters, hasActiveFilters, router]);

  const storesQuery = useStores({
    ...toStoresApiParams(filters),
    ...(isRandomSort && effectiveShuffleSeed
      ? { shuffleSeed: effectiveShuffleSeed }
      : {}),
    page,
    pageSize,
  });
  const citiesQuery = useCities();
  const stores = storesQuery.data?.items ?? [];
  const total = storesQuery.data?.total ?? 0;
  const currentPage = storesQuery.data?.page ?? page;
  const totalPages = storesQuery.data?.totalPages ?? 1;

  const totalLabel = (() => {
    if (storesQuery.isLoading) return "Carregando lojas…";
    if (filters.q) {
      return total === 1
        ? `1 loja para “${filters.q}”`
        : `${total} lojas para “${filters.q}”`;
    }
    if (hasActiveFilters) {
      return total === 1
        ? "1 loja nesta região"
        : `${total} lojas nesta região`;
    }
    return total === 1
      ? "1 loja no marketplace"
      : `${total} lojas no marketplace`;
  })();

  const applyFilters = useCallback(
    (next: StoresListingFilters) => {
      if (isRandomStoresSort(sort)) {
        setShuffleSeed(createListingShuffleSeed());
      }

      router.push(
        buildStoresHref({
          ...next,
          page: 1,
        }),
      );
    },
    [router, sort],
  );

  const goToPage = useCallback(
    (nextPage: number) => {
      const clampedPage = clampStoresListingPage(filters, nextPage);

      router.push(
        buildStoresHref({
          ...filters,
          page: clampedPage,
          shuffleSeed:
            isRandomStoresSort(sort) && clampedPage > 1 ? shuffleSeed : undefined,
        }),
      );
    },
    [filters, router, shuffleSeed, sort],
  );

  const changePageSize = useCallback(
    (nextPageSize: number) => {
      if (isRandomStoresSort(sort)) {
        setShuffleSeed(createListingShuffleSeed());
      }

      router.push(
        buildStoresHref({
          ...filters,
          pageSize: nextPageSize,
          page: 1,
        }),
      );
    },
    [filters, router, sort],
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Breadcrumb
          items={[{ label: "Home", href: ROUTES.HOME }, { label: "Lojas" }]}
        />
        <div className="flex flex-col gap-1.5">
          <h1 className="text-h1">Lojas</h1>
          <p className="text-body text-muted-foreground">{totalLabel}</p>
        </div>
      </header>

      <StoresRegionFilter
        cities={citiesQuery.data ?? []}
        values={filters}
        onApply={applyFilters}
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
      stores.length === 0 ? (
        <EmptyState
          title={
            hasActiveFilters
              ? "Nenhuma loja encontrada para os filtros selecionados."
              : "Nenhuma loja encontrada"
          }
          description={
            hasActiveFilters
              ? "Tente outro estado, cidade ou nome de loja."
              : "Ainda não há lojas com anúncios publicados no marketplace."
          }
          icon={<Store aria-hidden />}
        />
      ) : null}

      {!storesQuery.isLoading && !storesQuery.isError && stores.length > 0 ? (
        <>
          <SellerGrid sellers={stores} />
          <ListingPaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={goToPage}
            onPageSizeChange={changePageSize}
            pageSizeSelectId="stores-page-size"
          />
        </>
      ) : null}
    </div>
  );
}

export { StoresPageView };
