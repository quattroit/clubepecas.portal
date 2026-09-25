import { ROUTES } from "@/constants/routes";
import type {
  AdminSpecialtySortDir,
  AdminSpecialtySortParam,
  AdminSpecialtyStatusFilter,
  AdminSpecialtiesListParams,
} from "@/contracts/admin/specialties";
import { normalizeSearchQuery } from "@/utils/marketplace-search";

export type AdminSpecialtiesUrlFilters = {
  q?: string;
  status?: AdminSpecialtyStatusFilter;
  sort?: AdminSpecialtySortParam;
  sortDir?: AdminSpecialtySortDir;
};

const SORT_VALUES: AdminSpecialtySortParam[] = ["name", "order", "sellerCount"];

function isSort(value: string): value is AdminSpecialtySortParam {
  return SORT_VALUES.includes(value as AdminSpecialtySortParam);
}

function parseStatus(
  value: string | null,
): AdminSpecialtyStatusFilter | undefined {
  if (!value || value === "all") return undefined;
  if (value === "active" || value === "inactive") return value;
  return undefined;
}

export function parseAdminSpecialtiesFilters(
  params: URLSearchParams | string | null | undefined,
): AdminSpecialtiesUrlFilters {
  const search =
    typeof params === "string"
      ? new URLSearchParams(params)
      : (params ?? new URLSearchParams());

  const q = normalizeSearchQuery(search.get("q") ?? "");
  const status = parseStatus(search.get("status"));
  const sortRaw = search.get("sort")?.trim() ?? "";
  const sortDirRaw = search.get("sortDir")?.trim().toLowerCase() ?? "";

  const sort = isSort(sortRaw) ? sortRaw : undefined;
  const sortDir: AdminSpecialtySortDir | undefined =
    sortDirRaw === "asc" || sortDirRaw === "desc" ? sortDirRaw : undefined;

  return {
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    ...(sort ? { sort } : {}),
    ...(sortDir ? { sortDir } : {}),
  };
}

export function buildAdminSpecialtiesHref(
  filters: AdminSpecialtiesUrlFilters = {},
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
    ? `${ROUTES.ADMIN_SPECIALTIES}?${query}`
    : ROUTES.ADMIN_SPECIALTIES;
}

export function adminSpecialtiesHasActiveFilters(
  filters: AdminSpecialtiesUrlFilters,
): boolean {
  return Boolean(
    filters.q ||
      (filters.status && filters.status !== "all") ||
      (filters.sort && filters.sort !== "order") ||
      (filters.sortDir && filters.sortDir !== "asc"),
  );
}

export function toAdminSpecialtiesApiParams(
  filters: AdminSpecialtiesUrlFilters,
): AdminSpecialtiesListParams {
  return {
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    sort: filters.sort ?? "order",
    sortDir: filters.sortDir ?? "asc",
  };
}
