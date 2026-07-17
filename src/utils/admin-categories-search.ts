import { ROUTES } from "@/constants/routes";
import type {
  AdminCategoriesListParams,
  AdminCategorySortDir,
  AdminCategorySortParam,
  AdminCategoryStatusFilter,
} from "@/contracts/admin/categories";
import { normalizeSearchQuery } from "@/utils/marketplace-search";

export type AdminCategoriesUrlFilters = {
  q?: string;
  status?: AdminCategoryStatusFilter;
  sort?: AdminCategorySortParam;
  sortDir?: AdminCategorySortDir;
};

const SORT_VALUES: AdminCategorySortParam[] = [
  "name",
  "order",
  "advertisementCount",
];

function isSort(value: string): value is AdminCategorySortParam {
  return SORT_VALUES.includes(value as AdminCategorySortParam);
}

function parseStatus(
  value: string | null,
): AdminCategoryStatusFilter | undefined {
  if (!value || value === "all") return undefined;
  if (value === "active" || value === "inactive") return value;
  return undefined;
}

/**
 * Lê filtros da querystring `/admin/categorias`.
 */
export function parseAdminCategoriesFilters(
  params: URLSearchParams | string | null | undefined,
): AdminCategoriesUrlFilters {
  const search =
    typeof params === "string"
      ? new URLSearchParams(params)
      : (params ?? new URLSearchParams());

  const q = normalizeSearchQuery(search.get("q") ?? "");
  const status = parseStatus(search.get("status"));
  const sortRaw = search.get("sort")?.trim() ?? "";
  const sortDirRaw = search.get("sortDir")?.trim().toLowerCase() ?? "";

  const sort = isSort(sortRaw) ? sortRaw : undefined;
  const sortDir: AdminCategorySortDir | undefined =
    sortDirRaw === "asc" || sortDirRaw === "desc" ? sortDirRaw : undefined;

  return {
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    ...(sort ? { sort } : {}),
    ...(sortDir ? { sortDir } : {}),
  };
}

/**
 * Monta href de `/admin/categorias` (URL fonte da verdade).
 */
export function buildAdminCategoriesHref(
  filters: AdminCategoriesUrlFilters = {},
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
  return query
    ? `${ROUTES.ADMIN_CATEGORIES}?${query}`
    : ROUTES.ADMIN_CATEGORIES;
}

/**
 * Converte filtros da URL nos params da API.
 */
export function toAdminCategoriesApiParams(
  filters: AdminCategoriesUrlFilters,
): AdminCategoriesListParams {
  return {
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    sort: filters.sort ?? "order",
    sortDir: filters.sortDir ?? "asc",
  };
}

export function adminCategoriesHasActiveFilters(
  filters: AdminCategoriesUrlFilters,
): boolean {
  return Boolean(filters.q || filters.status);
}
