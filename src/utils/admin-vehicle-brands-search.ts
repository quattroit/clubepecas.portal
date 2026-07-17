import { ROUTES } from "@/constants/routes";
import type {
  AdminVehicleBrandSortDir,
  AdminVehicleBrandSortParam,
  AdminVehicleBrandStatusFilter,
  AdminVehicleBrandsListParams,
} from "@/contracts/admin/vehicle-brands";
import { normalizeSearchQuery } from "@/utils/marketplace-search";

export type AdminVehicleBrandsUrlFilters = {
  q?: string;
  status?: AdminVehicleBrandStatusFilter;
  sort?: AdminVehicleBrandSortParam;
  sortDir?: AdminVehicleBrandSortDir;
};

const SORT_VALUES: AdminVehicleBrandSortParam[] = [
  "name",
  "order",
  "advertisementCount",
];

function isSort(value: string): value is AdminVehicleBrandSortParam {
  return SORT_VALUES.includes(value as AdminVehicleBrandSortParam);
}

function parseStatus(
  value: string | null,
): AdminVehicleBrandStatusFilter | undefined {
  if (!value || value === "all") return undefined;
  if (value === "active" || value === "inactive") return value;
  return undefined;
}

/**
 * Lê filtros da querystring `/admin/marcas`.
 */
export function parseAdminVehicleBrandsFilters(
  params: URLSearchParams | string | null | undefined,
): AdminVehicleBrandsUrlFilters {
  const search =
    typeof params === "string"
      ? new URLSearchParams(params)
      : (params ?? new URLSearchParams());

  const q = normalizeSearchQuery(search.get("q") ?? "");
  const status = parseStatus(search.get("status"));
  const sortRaw = search.get("sort")?.trim() ?? "";
  const sortDirRaw = search.get("sortDir")?.trim().toLowerCase() ?? "";

  const sort = isSort(sortRaw) ? sortRaw : undefined;
  const sortDir: AdminVehicleBrandSortDir | undefined =
    sortDirRaw === "asc" || sortDirRaw === "desc" ? sortDirRaw : undefined;

  return {
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    ...(sort ? { sort } : {}),
    ...(sortDir ? { sortDir } : {}),
  };
}

/**
 * Monta href de `/admin/marcas` (URL fonte da verdade).
 */
export function buildAdminVehicleBrandsHref(
  filters: AdminVehicleBrandsUrlFilters = {},
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
    ? `${ROUTES.ADMIN_VEHICLE_BRANDS}?${query}`
    : ROUTES.ADMIN_VEHICLE_BRANDS;
}

/**
 * Converte filtros da URL nos params da API.
 */
export function toAdminVehicleBrandsApiParams(
  filters: AdminVehicleBrandsUrlFilters,
): AdminVehicleBrandsListParams {
  return {
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    sort: filters.sort ?? "order",
    sortDir: filters.sortDir ?? "asc",
  };
}

export function adminVehicleBrandsHasActiveFilters(
  filters: AdminVehicleBrandsUrlFilters,
): boolean {
  return Boolean(filters.q || filters.status);
}
