import { ROUTES } from "@/constants/routes";

/** Filtros da listagem pública `/lojas`. */
export type StoresListingFilters = {
  q?: string;
  state?: string;
  city?: string;
};

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

  return {
    ...(q ? { q } : {}),
    ...(!isAll(state) ? { state } : {}),
    ...(!isAll(city) ? { city } : {}),
  };
}

/**
 * Monta href de `/lojas` com filtros.
 */
export function buildStoresHref(filters: StoresListingFilters): string {
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

  const query = params.toString();
  return query ? `${ROUTES.STORES}?${query}` : ROUTES.STORES;
}
