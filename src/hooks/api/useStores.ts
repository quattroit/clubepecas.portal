"use client";

import { useQuery } from "@tanstack/react-query";

import type { ListPublicSellersRequest } from "@/contracts/seller/responses";
import { mapSellerPublicListItemToSeller } from "@/mappers/seller.mapper";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";
import { PUBLIC_LISTING_DEFAULT_PAGE_SIZE } from "@/utils/public-listing-pagination";

type UseStoresOptions = {
  enabled?: boolean;
};

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/**
 * Listagem pública de lojas (GET /api/v1/sellers).
 */
export function useStores(
  filters: ListPublicSellersRequest = {},
  options: UseStoresOptions = {},
) {
  const {
    page = 1,
    pageSize = PUBLIC_LISTING_DEFAULT_PAGE_SIZE,
    ...listFilters
  } = filters;
  const { enabled = true } = options;

  return useQuery({
    queryKey: queryKeys.marketplace.storesList({
      ...listFilters,
      page,
      pageSize,
    }),
    queryFn: async () => {
      const response = await sellerService.listPublic({
        ...listFilters,
        page,
        pageSize,
      });

      const apiTotal = readNumber(response.totalCount);
      const apiPage = readNumber(response.page) ?? page;
      const apiPageSize = readNumber(response.pageSize) ?? pageSize;
      const total =
        apiTotal ??
        (response.items.length >= apiPageSize
          ? apiPage * apiPageSize + response.items.length
          : (apiPage - 1) * apiPageSize + response.items.length);
      const totalPages = Math.max(1, Math.ceil(total / apiPageSize));

      return {
        items: response.items.map(mapSellerPublicListItemToSeller),
        total,
        page: apiPage,
        pageSize: apiPageSize,
        totalPages,
      };
    },
    enabled,
    staleTime: listFilters.sort === "random" ? 0 : 60_000,
  });
}
