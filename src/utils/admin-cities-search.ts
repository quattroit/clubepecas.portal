import { ROUTES } from "@/constants/routes";
import type {
  AdminCitiesListParams,
  AdminCitySortDir,
  AdminCitySortParam,
  AdminCityStatusFilter,
} from "@/contracts/admin/cities";
import { normalizeSearchQuery } from "@/utils/marketplace-search";

export type AdminCitiesUrlFilters = {
  q?: string;
  status?: AdminCityStatusFilter;
  sort?: AdminCitySortParam;
  sortDir?: AdminCitySortDir;
};

const SORT_VALUES: AdminCitySortParam[] = ["name", "order", "sellerCount"];

function isSort(value: string): value is AdminCitySortParam {
  return SORT_VALUES.includes(value as AdminCitySortParam);
}

function parseStatus(
  value: string | null,
): AdminCityStatusFilter | undefined {
  if (!value || value === "all") return undefined;
  if (value === "active" || value === "inactive") return value;
  return undefined;
}

/**
 * Lê filtros da querystring `/admin/cidades`.
 */
export function parseAdminCitiesFilters(
  params: URLSearchParams | string | null | undefined,
): AdminCitiesUrlFilters {
  const search =
    typeof params === "string"
      ? new URLSearchParams(params)
      : (params ?? new URLSearchParams());

  const q = normalizeSearchQuery(search.get("q") ?? "");
  const status = parseStatus(search.get("status"));
  const sortRaw = search.get("sort")?.trim() ?? "";
  const sortDirRaw = search.get("sortDir")?.trim().toLowerCase() ?? "";

  const sort = isSort(sortRaw) ? sortRaw : undefined;
  const sortDir: AdminCitySortDir | undefined =
    sortDirRaw === "asc" || sortDirRaw === "desc" ? sortDirRaw : undefined;

  return {
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    ...(sort ? { sort } : {}),
    ...(sortDir ? { sortDir } : {}),
  };
}

/**
 * Monta href de `/admin/cidades` (URL fonte da verdade).
 */
export function buildAdminCitiesHref(
  filters: AdminCitiesUrlFilters = {},
): string {
  const params = new URLSearchParams();

  const q = normalizeSearchQuery(filters.q ?? "");
  if (q) params.set("q", q);
  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }
  if (filters.sort && filters.sort !== "order") {
    params.set("sort", filters.sort);
  }
  if (filters.sortDir && filters.sortDir !== "asc") {
    params.set("sortDir", filters.sortDir);
  }

  const query = params.toString();
  return query ? `${ROUTES.ADMIN_CITIES}?${query}` : ROUTES.ADMIN_CITIES;
}

/**
 * Converte filtros da URL nos params da API.
 */
export function toAdminCitiesApiParams(
  filters: AdminCitiesUrlFilters,
): AdminCitiesListParams {
  return {
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    sort: filters.sort ?? "order",
    sortDir: filters.sortDir ?? "asc",
  };
}

export function adminCitiesHasActiveFilters(
  filters: AdminCitiesUrlFilters,
): boolean {
  return Boolean(filters.q || filters.status);
}
