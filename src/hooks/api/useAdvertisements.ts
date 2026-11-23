"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import {
  loadPublicMarketplaceList,
  sameMarketplaceListing,
  toMarketplaceListingFilters,
  type MarketplaceListFilters,
  type PublicMarketplaceList,
} from "@/lib/public-marketplace";

export type { MarketplaceListFilters } from "@/lib/public-marketplace";

type UseAdvertisementsOptions = {
  enabled?: boolean;
  initialData?: PublicMarketplaceList;
  initialDataUpdatedAt?: number;
  /** Filtros para os quais `initialData` foi buscado. */
  initialDataFilters?: MarketplaceListFilters;
};

/**
 * Listagem pública do marketplace (GET /api/v1/marketplace).
 */
export function useAdvertisements(
  filters: MarketplaceListFilters = {},
  options: UseAdvertisementsOptions = {},
) {
  const listingFilters = toMarketplaceListingFilters(filters);
  const { enabled = true } = options;
  const initialData = sameMarketplaceListing(
    listingFilters,
    options.initialDataFilters,
  )
    ? options.initialData
    : undefined;

  return useQuery({
    queryKey: queryKeys.marketplace.list(listingFilters),
    queryFn: () => loadPublicMarketplaceList(listingFilters),
    enabled,
    staleTime: listingFilters.sort === "random" ? 0 : 60_000,
    initialData,
    initialDataUpdatedAt: initialData
      ? options.initialDataUpdatedAt
      : undefined,
  });
}
