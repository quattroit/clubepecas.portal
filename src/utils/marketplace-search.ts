import { ROUTES } from "@/constants/routes";

import {
  parsePublicListingPageSize,
  PUBLIC_LISTING_DEFAULT_PAGE_SIZE,
} from "@/utils/public-listing-pagination";

/**
 * Remove espaços nas extremidades. Não altera o miolo da busca.
 */
export function normalizeSearchQuery(raw: string): string {
  return raw.trim();
}

export const MARKETPLACE_DEFAULT_SORT = "random";

/** Filtros da listagem pública espelhados na URL `/anuncios`. */
export type MarketplaceListingFilters = {
  q?: string;
  category?: string;
  /** Slug da marca de veículo (`?brand=`). */
  brand?: string;
  /** Slug do modelo de veículo (`?model=`). */
  model?: string;
  /** Ano de fabricação (`?manufacturingYear=`). */
  manufacturingYear?: string;
  /** Ano/modelo (`?modelYear=`). */
  modelYear?: string;
  state?: string;
  city?: string;
  priceMin?: string;
  priceMax?: string;
  newOnly?: boolean;
  sort?: string;
  shuffleSeed?: string;
  page?: number;
  pageSize?: number;
};

/** Máximo de páginas navegáveis em `/anuncios` sem filtros aplicados. */
export const MARKETPLACE_UNFILTERED_MAX_PAGES = 30;

export function isRandomMarketplaceSort(sort?: string): boolean {
  return (sort ?? MARKETPLACE_DEFAULT_SORT) === "random";
}

export function needsMarketplaceShuffleSeed(
  filters: MarketplaceListingFilters,
): boolean {
  return isRandomMarketplaceSort(filters.sort) && !filters.shuffleSeed;
}

export function hasActiveMarketplaceListingFilters(
  filters: MarketplaceListingFilters,
): boolean {
  return Boolean(
    filters.q ||
      filters.category ||
      filters.brand ||
      filters.model ||
      filters.manufacturingYear ||
      filters.modelYear ||
      filters.state ||
      filters.city ||
      filters.priceMin ||
      filters.priceMax ||
      filters.newOnly,
  );
}

export function clampMarketplaceListingPage(
  filters: MarketplaceListingFilters,
  page: number,
): number {
  const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;

  if (hasActiveMarketplaceListingFilters(filters)) {
    return normalizedPage;
  }

  return Math.min(normalizedPage, MARKETPLACE_UNFILTERED_MAX_PAGES);
}

function isAll(value: string | undefined): boolean {
  return !value || value.trim() === "" || value.trim() === "all";
}

function parseOptionalYearParam(raw: string | null): string | undefined {
  const value = raw?.trim() ?? "";
  if (!value || value === "all") return undefined;
  const year = Number(value);
  if (!Number.isInteger(year)) return undefined;
  return String(year);
}

/**
 * Lê filtros da querystring da listagem.
 */
export function parseMarketplaceListingFilters(
  params: URLSearchParams | string | null | undefined,
): MarketplaceListingFilters {
  const search =
    typeof params === "string"
      ? new URLSearchParams(params)
      : (params ?? new URLSearchParams());

  const q = normalizeSearchQuery(search.get("q") ?? "");
  const category = search.get("category")?.trim() ?? "";
  const brand = search.get("brand")?.trim() ?? "";
  const model = search.get("model")?.trim() ?? "";
  const manufacturingYear = parseOptionalYearParam(
    search.get("manufacturingYear"),
  );
  const modelYear = parseOptionalYearParam(search.get("modelYear"));
  const state = search.get("state")?.trim() ?? "";
  const city = search.get("city")?.trim() ?? "";
  const priceMin = search.get("priceMin")?.trim() ?? "";
  const priceMax = search.get("priceMax")?.trim() ?? "";
  const newOnly =
    search.get("newOnly") === "true" || search.get("newOnly") === "1";
  const sort = search.get("sort")?.trim() || MARKETPLACE_DEFAULT_SORT;
  const shuffleSeed = search.get("shuffleSeed")?.trim() ?? "";
  const pageRaw = Number(search.get("page") ?? "1");
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const pageSize = parsePublicListingPageSize(search.get("pageSize"));

  return {
    ...(q ? { q } : {}),
    ...(!isAll(category) ? { category } : {}),
    ...(!isAll(brand) ? { brand } : {}),
    ...(!isAll(model) ? { model } : {}),
    ...(manufacturingYear ? { manufacturingYear } : {}),
    ...(modelYear ? { modelYear } : {}),
    ...(!isAll(state) ? { state } : {}),
    ...(!isAll(city) ? { city } : {}),
    ...(priceMin ? { priceMin } : {}),
    ...(priceMax ? { priceMax } : {}),
    ...(newOnly ? { newOnly: true } : {}),
    ...(sort && sort !== MARKETPLACE_DEFAULT_SORT ? { sort } : {}),
    ...(shuffleSeed ? { shuffleSeed } : {}),
    ...(page > 1 ? { page } : {}),
    ...(pageSize !== PUBLIC_LISTING_DEFAULT_PAGE_SIZE ? { pageSize } : {}),
  };
}

/**
 * Monta `/anuncios` ou `/anuncios?…` a partir dos filtros (URL é a fonte da verdade).
 */
export function buildAdvertisementsHref(
  filters: MarketplaceListingFilters = {},
): string {
  const params = new URLSearchParams();

  const q = normalizeSearchQuery(filters.q ?? "");
  if (q) {
    params.set("q", q);
  }

  if (!isAll(filters.category)) {
    params.set("category", filters.category!.trim());
  }

  if (!isAll(filters.brand)) {
    params.set("brand", filters.brand!.trim());
  }

  if (!isAll(filters.model)) {
    params.set("model", filters.model!.trim());
  }

  if (filters.manufacturingYear?.trim() && !isAll(filters.manufacturingYear)) {
    params.set("manufacturingYear", filters.manufacturingYear.trim());
  }

  if (filters.modelYear?.trim() && !isAll(filters.modelYear)) {
    params.set("modelYear", filters.modelYear.trim());
  }

  if (!isAll(filters.state)) {
    params.set("state", filters.state!.trim().toUpperCase());
  }

  if (filters.city?.trim() && filters.city.trim() !== "all") {
    params.set("city", filters.city.trim());
  }

  if (filters.priceMin?.trim()) {
    params.set("priceMin", filters.priceMin.trim());
  }

  if (filters.priceMax?.trim()) {
    params.set("priceMax", filters.priceMax.trim());
  }

  if (filters.newOnly) {
    params.set("newOnly", "true");
  }

  const sort = filters.sort ?? MARKETPLACE_DEFAULT_SORT;
  if (sort !== MARKETPLACE_DEFAULT_SORT) {
    params.set("sort", sort);
  }

  if (isRandomMarketplaceSort(sort) && filters.shuffleSeed?.trim()) {
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
  return query ? `${ROUTES.ADVERTISEMENTS}?${query}` : ROUTES.ADVERTISEMENTS;
}

/**
 * Converte filtros da URL nos query params da API GET /marketplace.
 */
export function toMarketplaceApiParams(filters: MarketplaceListingFilters): {
  q?: string;
  categoryId?: number;
  vehicleBrandSlug?: string;
  vehicleModelSlug?: string;
  manufacturingYear?: number;
  modelYear?: number;
  city?: string;
  state?: string;
  priceMin?: number;
  priceMax?: number;
  newOnly?: boolean;
  sort?: string;
  shuffleSeed?: string;
  page?: number;
  pageSize?: number;
} {
  const manufacturingYear = filters.manufacturingYear
    ? Number(filters.manufacturingYear)
    : NaN;
  const modelYear = filters.modelYear ? Number(filters.modelYear) : NaN;
  const page = clampMarketplaceListingPage(filters, filters.page ?? 1);
  const pageSize = filters.pageSize ?? PUBLIC_LISTING_DEFAULT_PAGE_SIZE;
  const sort = filters.sort ?? MARKETPLACE_DEFAULT_SORT;

  return {
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.category
      ? { categoryId: Number(filters.category) }
      : {}),
    ...(filters.brand ? { vehicleBrandSlug: filters.brand } : {}),
    ...(filters.model ? { vehicleModelSlug: filters.model } : {}),
    ...(Number.isInteger(manufacturingYear)
      ? { manufacturingYear }
      : {}),
    ...(Number.isInteger(modelYear) ? { modelYear } : {}),
    ...(filters.city && !isAll(filters.city) ? { city: filters.city } : {}),
    ...(filters.state ? { state: filters.state.toUpperCase() } : {}),
    ...(filters.priceMin && !Number.isNaN(Number(filters.priceMin))
      ? { priceMin: Number(filters.priceMin) }
      : {}),
    ...(filters.priceMax && !Number.isNaN(Number(filters.priceMax))
      ? { priceMax: Number(filters.priceMax) }
      : {}),
    ...(filters.newOnly ? { newOnly: true } : {}),
    sort,
    ...(isRandomMarketplaceSort(sort) && filters.shuffleSeed
      ? { shuffleSeed: filters.shuffleSeed }
      : {}),
    page,
    pageSize,
  };
}
