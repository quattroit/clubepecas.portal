import { ROUTES } from "@/constants/routes";

import {
  parsePublicListingPageSize,
  PUBLIC_LISTING_DEFAULT_PAGE_SIZE,
} from "@/utils/public-listing-pagination";

export const STORES_DEFAULT_SORT = "random";

/** Filtros da listagem pública `/lojas`. */
export type StoresListingFilters = {
  q?: string;
  state?: string;
  city?: string;
  sort?: string;
  shuffleSeed?: string;
  page?: number;
  pageSize?: number;
};

/** Máximo de páginas navegáveis em `/lojas` sem filtros aplicados. */
export const STORES_UNFILTERED_MAX_PAGES = 30;

export function isRandomStoresSort(sort?: string): boolean {
  return (sort ?? STORES_DEFAULT_SORT) === "random";
}

export function needsStoresShuffleSeed(filters: StoresListingFilters): boolean {
  return isRandomStoresSort(filters.sort) && !filters.shuffleSeed;
}

export function hasActiveStoresListingFilters(
  filters: StoresListingFilters,
): boolean {
  return Boolean(filters.q || filters.state || filters.city);
}

export function clampStoresListingPage(
  filters: StoresListingFilters,
  page: number,
): number {
  const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;

  if (hasActiveStoresListingFilters(filters)) {
    return normalizedPage;
  }

  return Math.min(normalizedPage, STORES_UNFILTERED_MAX_PAGES);
}

function isAll(value: string | undefined): boolean {
  return !value || value.trim() === "" || value.trim() === "all";
}

/**
 * Lê filtros da querystring de `/lojas`.
 */
export function parseStoresListingFilters(
  params: URLSearchParams | string | null | undefined,
): StoresListingFilters {
  const search =
    typeof params === "string"
      ? new URLSearchParams(params)
      : (params ?? new URLSearchParams());

  const q = search.get("q")?.trim() ?? "";
  const state = search.get("state")?.trim().toUpperCase() ?? "";
  const city = search.get("city")?.trim() ?? "";
  const sort = search.get("sort")?.trim() || STORES_DEFAULT_SORT;
  const shuffleSeed = search.get("shuffleSeed")?.trim() ?? "";
  const pageRaw = Number(search.get("page") ?? "1");
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const pageSize = parsePublicListingPageSize(search.get("pageSize"));

  return {
    ...(q ? { q } : {}),
    ...(!isAll(state) ? { state } : {}),
    ...(!isAll(city) ? { city } : {}),
    ...(sort && sort !== STORES_DEFAULT_SORT ? { sort } : {}),
    ...(shuffleSeed ? { shuffleSeed } : {}),
    ...(page > 1 ? { page } : {}),
    ...(pageSize !== PUBLIC_LISTING_DEFAULT_PAGE_SIZE ? { pageSize } : {}),
  };
}

/**
 * Monta href de `/lojas` com filtros.
 */
export function buildStoresHref(filters: StoresListingFilters = {}): string {
  const params = new URLSearchParams();

  if (filters.q?.trim()) {
    params.set("q", filters.q.trim());
  }
  if (!isAll(filters.state)) {
    params.set("state", filters.state!.trim().toUpperCase());
  }
  if (!isAll(filters.city)) {
    params.set("city", filters.city!.trim());
  }

  const sort = filters.sort ?? STORES_DEFAULT_SORT;
  if (sort !== STORES_DEFAULT_SORT) {
    params.set("sort", sort);
  }

  if (isRandomStoresSort(sort) && filters.shuffleSeed?.trim()) {
    params.set("shuffleSeed", filters.shuffleSeed.trim());
  }

  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }

  if (
    filters.pageSize &&
    filters.pageSize !== PUBLIC_LISTING_DEFAULT_PAGE_SIZE
  ) {
    params.set("pageSize", String(filters.pageSize));
  }

  const query = params.toString();
  return query ? `${ROUTES.STORES}?${query}` : ROUTES.STORES;
}

export function toStoresApiParams(filters: StoresListingFilters): {
  q?: string;
  state?: string;
  city?: string;
  sort?: string;
  shuffleSeed?: string;
  page: number;
  pageSize: number;
} {
  const sort = filters.sort ?? STORES_DEFAULT_SORT;

  return {
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.state ? { state: filters.state.toUpperCase() } : {}),
    ...(filters.city && !isAll(filters.city) ? { city: filters.city } : {}),
    sort,
    ...(isRandomStoresSort(sort) && filters.shuffleSeed
      ? { shuffleSeed: filters.shuffleSeed }
      : {}),
    page: clampStoresListingPage(filters, filters.page ?? 1),
    pageSize: filters.pageSize ?? PUBLIC_LISTING_DEFAULT_PAGE_SIZE,
  };
}
