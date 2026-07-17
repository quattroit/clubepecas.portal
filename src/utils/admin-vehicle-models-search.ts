import { ROUTES } from "@/constants/routes";
import type {
  AdminVehicleModelSortDir,
  AdminVehicleModelSortParam,
  AdminVehicleModelStatusFilter,
  AdminVehicleModelsListParams,
} from "@/contracts/admin/vehicle-models";
import { normalizeSearchQuery } from "@/utils/marketplace-search";

export type AdminVehicleModelsUrlFilters = {
  q?: string;
  status?: AdminVehicleModelStatusFilter;
  sort?: AdminVehicleModelSortParam;
  sortDir?: AdminVehicleModelSortDir;
  brandId?: string;
};

const SORT_VALUES: AdminVehicleModelSortParam[] = [
  "name",
  "order",
  "advertisementCount",
];

function isSort(value: string): value is AdminVehicleModelSortParam {
  return SORT_VALUES.includes(value as AdminVehicleModelSortParam);
}

function parseStatus(
  value: string | null,
): AdminVehicleModelStatusFilter | undefined {
  if (!value || value === "all") return undefined;
  if (value === "active" || value === "inactive") return value;
  return undefined;
}

/**
 * Lê filtros da querystring `/admin/modelos`.
 */
export function parseAdminVehicleModelsFilters(
  params: URLSearchParams | string | null | undefined,
): AdminVehicleModelsUrlFilters {
  const search =
    typeof params === "string"
      ? new URLSearchParams(params)
      : (params ?? new URLSearchParams());

  const q = normalizeSearchQuery(search.get("q") ?? "");
  const status = parseStatus(search.get("status"));
  const brandId = search.get("brandId")?.trim() ?? "";
  const sortRaw = search.get("sort")?.trim() ?? "";
  const sortDirRaw = search.get("sortDir")?.trim().toLowerCase() ?? "";

  const sort = isSort(sortRaw) ? sortRaw : undefined;
  const sortDir: AdminVehicleModelSortDir | undefined =
    sortDirRaw === "asc" || sortDirRaw === "desc" ? sortDirRaw : undefined;

  return {
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    ...(brandId ? { brandId } : {}),
    ...(sort ? { sort } : {}),
    ...(sortDir ? { sortDir } : {}),
  };
}

/**
 * Monta href de `/admin/modelos` (URL fonte da verdade).
 */
export function buildAdminVehicleModelsHref(
  filters: AdminVehicleModelsUrlFilters = {},
): string {
  const params = new URLSearchParams();

  const q = normalizeSearchQuery(filters.q ?? "");
  if (q) params.set("q", q);
  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }
  if (filters.brandId?.trim()) {
    params.set("brandId", filters.brandId.trim());
  }
  if (filters.sort && filters.sort !== "order") {
    params.set("sort", filters.sort);
  }
  if (filters.sortDir && filters.sortDir !== "asc") {
    params.set("sortDir", filters.sortDir);
  }

  const query = params.toString();
  return query
    ? `${ROUTES.ADMIN_VEHICLE_MODELS}?${query}`
    : ROUTES.ADMIN_VEHICLE_MODELS;
}

/**
 * Converte filtros da URL nos params da API.
 */
export function toAdminVehicleModelsApiParams(
  filters: AdminVehicleModelsUrlFilters,
): AdminVehicleModelsListParams {
  return {
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.brandId ? { brandId: filters.brandId } : {}),
    sort: filters.sort ?? "order",
    sortDir: filters.sortDir ?? "asc",
  };
}

export function adminVehicleModelsHasActiveFilters(
  filters: AdminVehicleModelsUrlFilters,
): boolean {
  return Boolean(filters.q || filters.status || filters.brandId);
}
