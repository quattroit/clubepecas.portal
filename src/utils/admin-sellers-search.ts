import { ROUTES } from "@/constants/routes";
import type {
  AdminSellerPlanFilter,
  AdminSellerSortDir,
  AdminSellerSortParam,
  AdminSellerStatusFilter,
  AdminSellersListParams,
} from "@/contracts/admin/sellers";
import { normalizeSearchQuery } from "@/utils/marketplace-search";

export type AdminSellersUrlFilters = {
  q?: string;
  status?: AdminSellerStatusFilter;
  plan?: AdminSellerPlanFilter;
  city?: string;
  state?: string;
  createdFrom?: string;
  createdTo?: string;
  lastAccessFrom?: string;
  lastAccessTo?: string;
  sort?: AdminSellerSortParam;
  sortDir?: AdminSellerSortDir;
  page?: number;
  pageSize?: number;
};

const SORT_VALUES: AdminSellerSortParam[] = [
  "name",
  "createdAt",
  "lastAccess",
  "advertisementCount",
  "views",
  "conversion",
];

function isSort(value: string): value is AdminSellerSortParam {
  return SORT_VALUES.includes(value as AdminSellerSortParam);
}

function parseStatus(value: string | null): AdminSellerStatusFilter | undefined {
  if (!value || value === "all") return undefined;
  if (value === "active" || value === "inactive") return value;
  return undefined;
}

function parsePlan(value: string | null): AdminSellerPlanFilter | undefined {
  if (!value || value === "all") return undefined;
  if (
    value === "basic" ||
    value === "intermediate" ||
    value === "premium"
  ) {
    return value;
  }
  return undefined;
}

/**
 * Lê filtros da querystring `/admin/vendedores`.
 */
export function parseAdminSellersFilters(
  params: URLSearchParams | string | null | undefined,
): AdminSellersUrlFilters {
  const search =
    typeof params === "string"
      ? new URLSearchParams(params)
      : (params ?? new URLSearchParams());

  const q = normalizeSearchQuery(search.get("q") ?? "");
  const status = parseStatus(search.get("status"));
  const plan = parsePlan(search.get("plan"));
  const city = search.get("city")?.trim() ?? "";
  const state = search.get("state")?.trim() ?? "";
  const createdFrom = search.get("createdFrom")?.trim() ?? "";
  const createdTo = search.get("createdTo")?.trim() ?? "";
  const lastAccessFrom = search.get("lastAccessFrom")?.trim() ?? "";
  const lastAccessTo = search.get("lastAccessTo")?.trim() ?? "";
  const sortRaw = search.get("sort")?.trim() ?? "";
  const sortDirRaw = search.get("sortDir")?.trim().toLowerCase() ?? "";
  const pageRaw = Number(search.get("page") ?? "1");
  const pageSizeRaw = Number(search.get("pageSize") ?? "20");

  const sort = isSort(sortRaw) ? sortRaw : undefined;
  const sortDir: AdminSellerSortDir | undefined =
    sortDirRaw === "asc" || sortDirRaw === "desc" ? sortDirRaw : undefined;

  return {
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    ...(plan ? { plan } : {}),
    ...(city ? { city } : {}),
    ...(state ? { state: state.toUpperCase() } : {}),
    ...(createdFrom ? { createdFrom } : {}),
    ...(createdTo ? { createdTo } : {}),
    ...(lastAccessFrom ? { lastAccessFrom } : {}),
    ...(lastAccessTo ? { lastAccessTo } : {}),
    ...(sort ? { sort } : {}),
    ...(sortDir ? { sortDir } : {}),
    ...(Number.isFinite(pageRaw) && pageRaw > 1 ? { page: Math.floor(pageRaw) } : {}),
    ...(Number.isFinite(pageSizeRaw) && pageSizeRaw !== 20 && pageSizeRaw > 0
      ? { pageSize: Math.min(100, Math.floor(pageSizeRaw)) }
      : {}),
  };
}

/**
 * Monta href de `/admin/vendedores` a partir dos filtros (URL fonte da verdade).
 */
export function buildAdminSellersHref(
  filters: AdminSellersUrlFilters = {},
): string {
  const params = new URLSearchParams();

  const q = normalizeSearchQuery(filters.q ?? "");
  if (q) params.set("q", q);
  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }
  if (filters.plan && filters.plan !== "all") {
    params.set("plan", filters.plan);
  }
  if (filters.city?.trim()) params.set("city", filters.city.trim());
  if (filters.state?.trim()) {
    params.set("state", filters.state.trim().toUpperCase());
  }
  if (filters.createdFrom?.trim()) {
    params.set("createdFrom", filters.createdFrom.trim());
  }
  if (filters.createdTo?.trim()) {
    params.set("createdTo", filters.createdTo.trim());
  }
  if (filters.lastAccessFrom?.trim()) {
    params.set("lastAccessFrom", filters.lastAccessFrom.trim());
  }
  if (filters.lastAccessTo?.trim()) {
    params.set("lastAccessTo", filters.lastAccessTo.trim());
  }
  if (filters.sort && filters.sort !== "createdAt") {
    params.set("sort", filters.sort);
  }
  if (filters.sortDir && filters.sortDir !== "desc") {
    params.set("sortDir", filters.sortDir);
  }
  // Quando sort customizado, sempre incluir sortDir se for asc; se sort é name e asc default, ok
  if (filters.sort && filters.sort !== "createdAt" && filters.sortDir === "desc") {
    // desc é default da API para a maioria — omitimos
  }
  if (filters.sort === "name" && (!filters.sortDir || filters.sortDir === "asc")) {
    if (!params.has("sort")) params.set("sort", "name");
  }
  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }
  if (filters.pageSize && filters.pageSize !== 20) {
    params.set("pageSize", String(filters.pageSize));
  }

  const query = params.toString();
  return query
    ? `${ROUTES.ADMIN_SELLERS}?${query}`
    : ROUTES.ADMIN_SELLERS;
}

/**
 * Converte filtros da URL nos params da API.
 */
export function toAdminSellersApiParams(
  filters: AdminSellersUrlFilters,
): AdminSellersListParams {
  return {
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.plan ? { plan: filters.plan } : {}),
    ...(filters.city ? { city: filters.city } : {}),
    ...(filters.state ? { state: filters.state } : {}),
    ...(filters.createdFrom ? { createdFrom: filters.createdFrom } : {}),
    ...(filters.createdTo ? { createdTo: filters.createdTo } : {}),
    ...(filters.lastAccessFrom
      ? { lastAccessFrom: filters.lastAccessFrom }
      : {}),
    ...(filters.lastAccessTo ? { lastAccessTo: filters.lastAccessTo } : {}),
    sort: filters.sort ?? "createdAt",
    sortDir:
      filters.sortDir ??
      (filters.sort === "name" ? "asc" : "desc"),
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 20,
  };
}

export function adminSellerHasActiveFilters(
  filters: AdminSellersUrlFilters,
): boolean {
  return Boolean(
    filters.q ||
      filters.status ||
      filters.plan ||
      filters.city ||
      filters.state ||
      filters.createdFrom ||
      filters.createdTo ||
      filters.lastAccessFrom ||
      filters.lastAccessTo,
  );
}
