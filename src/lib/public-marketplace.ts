import type { GetMarketplaceRequest } from "@/contracts/categories/requests";
import type { GetMarketplaceResponse } from "@/contracts/categories/responses";
import { mapMarketplaceItemToAdvertisement } from "@/mappers/advertisement.mapper";
import { categoryService } from "@/services/category.service";
import type { Advertisement } from "@/types/Advertisement";
import { PUBLIC_LISTING_DEFAULT_PAGE_SIZE } from "@/utils/public-listing-pagination";

export type MarketplaceListFilters = GetMarketplaceRequest & {
  page?: number;
  pageSize?: number;
};

export type PublicMarketplaceList = {
  items: Advertisement[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMorePages: boolean;
};

const DEFAULT_PAGE_SIZE = PUBLIC_LISTING_DEFAULT_PAGE_SIZE;

type RawMarketplaceResponse = GetMarketplaceResponse & Record<string, unknown>;

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

/** Mesmo objeto usado na queryKey de `useAdvertisements`. */
export function toMarketplaceListingFilters(
  filters: MarketplaceListFilters,
): MarketplaceListFilters {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, ...marketplaceFilters } =
    filters;

  return {
    ...marketplaceFilters,
    page,
    pageSize,
  };
}

export function sameMarketplaceListing(
  current: MarketplaceListFilters,
  seeded: MarketplaceListFilters | undefined,
): boolean {
  if (!seeded) return false;

  return (
    JSON.stringify(toMarketplaceListingFilters(current)) ===
    JSON.stringify(toMarketplaceListingFilters(seeded))
  );
}

/** GET /api/v1/marketplace já mapeado para a listagem pública. */
export async function loadPublicMarketplaceList(
  filters: MarketplaceListFilters,
): Promise<PublicMarketplaceList> {
  const listingFilters = toMarketplaceListingFilters(filters);
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, ...marketplaceFilters } =
    listingFilters;
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
}
