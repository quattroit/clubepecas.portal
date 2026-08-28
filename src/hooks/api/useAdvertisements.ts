"use client";

import { useQuery } from "@tanstack/react-query";

import type { GetMarketplaceRequest } from "@/contracts/categories/requests";
import type { GetMarketplaceResponse } from "@/contracts/categories/responses";
import { mapMarketplaceItemToAdvertisement } from "@/mappers/advertisement.mapper";
import { queryKeys } from "@/lib/queryKeys";
import { categoryService } from "@/services/category.service";

export type MarketplaceListFilters = GetMarketplaceRequest & {
  page?: number;
  pageSize?: number;
};

type UseAdvertisementsOptions = {
  enabled?: boolean;
};

const DEFAULT_PAGE_SIZE = 10;

type RawMarketplaceResponse = GetMarketplaceResponse &
  Record<string, unknown>;

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function resolveMarketplacePagination(
  response: RawMarketplaceResponse,
  page: number,
  pageSize: number,
) {
  const items = response.items ?? [];
  const apiTotal =
    readNumber(response.totalCount) ?? readNumber(response.TotalCount);
  const apiPage = readNumber(response.page) ?? readNumber(response.Page) ?? page;
  const apiPageSize =
    readNumber(response.pageSize) ??
    readNumber(response.PageSize) ??
    pageSize;

  if (apiTotal !== undefined) {
    const totalPages = Math.max(1, Math.ceil(apiTotal / apiPageSize));
    return {
      total: apiTotal,
      page: apiPage,
      pageSize: apiPageSize,
      totalPages,
      hasMorePages: totalPages > 1,
    };
  }

  // API legada sem totalCount: se a página veio cheia, assume que há próxima.
  const filledPage = items.length >= apiPageSize;
  const totalPages = filledPage ? Math.max(2, apiPage + 1) : apiPage;

  return {
    total: filledPage
      ? apiPage * apiPageSize + items.length
      : (apiPage - 1) * apiPageSize + items.length,
    page: apiPage,
    pageSize: apiPageSize,
    totalPages,
    hasMorePages: filledPage,
  };
}

/**
 * Listagem pública do marketplace (GET /api/v1/marketplace).
 */
export function useAdvertisements(
  filters: MarketplaceListFilters = {},
  options: UseAdvertisementsOptions = {},
) {
  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    ...marketplaceFilters
  } = filters;
  const { enabled = true } = options;

  return useQuery({
    queryKey: queryKeys.marketplace.list({
      ...marketplaceFilters,
      page,
      pageSize,
    }),
    queryFn: async () => {
      const response = (await categoryService.getMarketplace({
        ...marketplaceFilters,
        page,
        pageSize,
      })) as RawMarketplaceResponse;

      const mappedItems = (response.items ?? []).map(
        mapMarketplaceItemToAdvertisement,
      );
      const pagination = resolveMarketplacePagination(
        { ...response, items: response.items ?? [] },
        page,
        pageSize,
      );

      return {
        items: mappedItems,
        ...pagination,
      };
    },
    enabled,
    staleTime: marketplaceFilters.sort === "random" ? 0 : 60_000,
  });
}
