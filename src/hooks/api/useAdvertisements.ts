"use client";

import { useQuery } from "@tanstack/react-query";

import type { GetMarketplaceRequest } from "@/contracts/categories/requests";
import { mapMarketplaceItemToAdvertisement } from "@/mappers/advertisement.mapper";
import { queryKeys } from "@/lib/queryKeys";
import { categoryService } from "@/services/category.service";

export type MarketplaceListFilters = GetMarketplaceRequest & {
  page?: number;
};

type UseAdvertisementsOptions = {
  enabled?: boolean;
};

/**
 * Listagem pública do marketplace (GET /api/v1/marketplace).
 *
 * Fluxo: categoryService.getMarketplace → MarketplaceItemDto[]
 * → mapMarketplaceItemToAdvertisement → Advertisement[]
 *
 * Paginação preparada (API atual devolve lista única).
 */
export function useAdvertisements(
  filters: MarketplaceListFilters = {},
  options: UseAdvertisementsOptions = {},
) {
  const { page = 1, ...marketplaceFilters } = filters;
  const { enabled = true } = options;

  return useQuery({
    queryKey: queryKeys.marketplace.list({
      ...marketplaceFilters,
      page,
    }),
    queryFn: async () => {
      const response = await categoryService.getMarketplace(marketplaceFilters);
      const items = response.items.map(mapMarketplaceItemToAdvertisement);

      return {
        items,
        total: items.length,
        page,
        /** API ainda não pagina — estrutura pronta para evolução */
        totalPages: 1,
      };
    },
    enabled,
  });
}
