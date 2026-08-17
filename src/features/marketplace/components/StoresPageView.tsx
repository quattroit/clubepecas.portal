"use client";

import { Store } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";
import { SellerGrid } from "@/features/marketplace";
import { StoresGridSkeleton } from "@/features/marketplace/components/StoresGridSkeleton";
import { StoresRegionFilter } from "@/features/marketplace/components/StoresRegionFilter";
import { useCities } from "@/hooks/api/useCities";
import { useStores } from "@/hooks/api/useStores";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import type { Seller } from "@/types/Seller";
import {
  buildStoresHref,
  parseStoresListingFilters,
  type StoresListingFilters,
} from "@/utils/stores-search";

function matchesStoreFilters(
  store: Seller,
  filters: StoresListingFilters,
): boolean {
  if (filters.q) {
    const query = filters.q.toLowerCase();
    const haystack = store.name.toLowerCase();
    if (!haystack.includes(query)) {
      return false;
    }
  }

  if (filters.state) {
    if (store.state.toUpperCase() !== filters.state.toUpperCase()) {
      return false;
    }
  }

  if (filters.city) {
    const cityFilter = filters.city.toLowerCase();
    const bySlug = store.citySlug?.toLowerCase() === cityFilter;
    const byName = store.city.toLowerCase() === cityFilter;
    if (!bySlug && !byName) {
      return false;
    }
  }

  return true;
}

/**
 * Listagem pública /lojas — mesma UI, dados da API.
 */
function StoresPageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseStoresListingFilters(searchParams);

  const storesQuery = useStores();
  const citiesQuery = useCities();
  const stores = storesQuery.data ?? [];

  const filteredStores = useMemo(
    () => stores.filter((store) => matchesStoreFilters(store, filters)),
    [stores, filters],
  );

  const hasActiveFilters = Boolean(filters.q || filters.state || filters.city);

  const totalLabel = (() => {
    if (storesQuery.isLoading) return "Carregando lojas…";
    if (filters.q) {
      return filteredStores.length === 1
        ? `1 loja para “${filters.q}”`
        : `${filteredStores.length} lojas para “${filters.q}”`;
    }
    if (hasActiveFilters) {
      return filteredStores.length === 1
        ? "1 loja nesta região"
        : `${filteredStores.length} lojas nesta região`;
    }
    return filteredStores.length === 1
      ? "1 loja no marketplace"
      : `${filteredStores.length} lojas no marketplace`;
  })();

  const applyFilters = useCallback(
    (next: StoresListingFilters) => {
      router.push(buildStoresHref(next));
    },
    [router],
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
      filteredStores.length === 0 ? (
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

      {!storesQuery.isLoading &&
      !storesQuery.isError &&
      filteredStores.length > 0 ? (
        <SellerGrid sellers={filteredStores} />
      ) : null}
    </div>
  );
}

export { StoresPageView };
