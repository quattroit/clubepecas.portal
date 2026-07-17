import { ROUTES } from "@/constants/routes";

/**
 * Remove espaços nas extremidades. Não altera o miolo da busca.
 */
export function normalizeSearchQuery(raw: string): string {
  return raw.trim();
}

/** Filtros da listagem pública espelhados na URL `/anuncios`. */
export type MarketplaceListingFilters = {
  q?: string;
  category?: string;
  /** Slug da marca de veículo (`?brand=`). */
  brand?: string;
  /** Slug do modelo de veículo (`?model=`). */
  model?: string;
  state?: string;
  city?: string;
  priceMin?: string;
  priceMax?: string;
  newOnly?: boolean;
  sort?: string;
};

function isAll(value: string | undefined): boolean {
  return !value || value.trim() === "" || value.trim() === "all";
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
  const state = search.get("state")?.trim() ?? "";
  const city = search.get("city")?.trim() ?? "";
  const priceMin = search.get("priceMin")?.trim() ?? "";
  const priceMax = search.get("priceMax")?.trim() ?? "";
  const newOnly =
    search.get("newOnly") === "true" || search.get("newOnly") === "1";
  const sort = search.get("sort")?.trim() || "recent";

  return {
    ...(q ? { q } : {}),
    ...(!isAll(category) ? { category } : {}),
    ...(!isAll(brand) ? { brand } : {}),
    ...(!isAll(model) ? { model } : {}),
    ...(!isAll(state) ? { state } : {}),
    ...(!isAll(city) ? { city } : {}),
    ...(priceMin ? { priceMin } : {}),
    ...(priceMax ? { priceMax } : {}),
    ...(newOnly ? { newOnly: true } : {}),
    ...(sort && sort !== "recent" ? { sort } : {}),
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

  if (filters.sort && filters.sort !== "recent") {
    params.set("sort", filters.sort);
  }

  const query = params.toString();
  return query ? `${ROUTES.ADVERTISEMENTS}?${query}` : ROUTES.ADVERTISEMENTS;
}

/**
 * Converte filtros da URL nos query params da API GET /marketplace.
 */
export function toMarketplaceApiParams(filters: MarketplaceListingFilters): {
  q?: string;
  categoryId?: string;
  vehicleBrandSlug?: string;
  vehicleModelSlug?: string;
  city?: string;
  state?: string;
  priceMin?: number;
  priceMax?: number;
  newOnly?: boolean;
  sort?: string;
} {
  return {
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.category ? { categoryId: filters.category } : {}),
    ...(filters.brand ? { vehicleBrandSlug: filters.brand } : {}),
    ...(filters.model ? { vehicleModelSlug: filters.model } : {}),
    ...(filters.city && !isAll(filters.city) ? { city: filters.city } : {}),
    ...(filters.state ? { state: filters.state.toUpperCase() } : {}),
    ...(filters.priceMin && !Number.isNaN(Number(filters.priceMin))
      ? { priceMin: Number(filters.priceMin) }
      : {}),
    ...(filters.priceMax && !Number.isNaN(Number(filters.priceMax))
      ? { priceMax: Number(filters.priceMax) }
      : {}),
    ...(filters.newOnly ? { newOnly: true } : {}),
    ...(filters.sort && filters.sort !== "recent" ? { sort: filters.sort } : {}),
  };
}
