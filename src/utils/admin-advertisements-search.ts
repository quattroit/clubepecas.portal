import { ROUTES } from "@/constants/routes";
import type {
  AdminAdvertisementSortDir,
  AdminAdvertisementSortParam,
  AdminAdvertisementStatusFilter,
  AdminAdvertisementsListParams,
} from "@/contracts/admin/advertisements";
import { normalizeSearchQuery } from "@/utils/marketplace-search";

export type AdminAdvertisementsUrlFilters = {
  q?: string;
  status?: AdminAdvertisementStatusFilter;
  categoryId?: number;
  city?: string;
  state?: string;
  store?: string;
  publishedFrom?: string;
  publishedTo?: string;
  stockMin?: string;
  stockMax?: string;
  sort?: AdminAdvertisementSortParam;
  sortDir?: AdminAdvertisementSortDir;
  page?: number;
  pageSize?: number;
};

const SORT_VALUES: AdminAdvertisementSortParam[] = [
  "newest",
  "oldest",
  "title",
  "store",
  "views",
  "whatsappClicks",
  "conversion",
  "stock",
];

function isSort(value: string): value is AdminAdvertisementSortParam {
  return SORT_VALUES.includes(value as AdminAdvertisementSortParam);
}

function parseStatus(
  value: string | null,
): AdminAdvertisementStatusFilter | undefined {
  if (!value || value === "all") return undefined;
  if (value === "active" || value === "inactive") return value;
  return undefined;
}

/**
 * Lê filtros da querystring `/admin/anuncios`.
 */
export function parseAdminAdvertisementsFilters(
  params: URLSearchParams | string | null | undefined,
): AdminAdvertisementsUrlFilters {
  const search =
    typeof params === "string"
      ? new URLSearchParams(params)
      : (params ?? new URLSearchParams());

  const q = normalizeSearchQuery(search.get("q") ?? "");
  const status = parseStatus(search.get("status"));
  const categoryRaw =
    search.get("categoryId")?.trim() ||
    search.get("category")?.trim() ||
    "";
  const categoryIdParsed = Number(categoryRaw);
  const categoryId =
    categoryRaw && Number.isInteger(categoryIdParsed) && categoryIdParsed > 0
      ? categoryIdParsed
      : undefined;
  const city = search.get("city")?.trim() ?? "";
  const state = search.get("state")?.trim() ?? "";
  const store = search.get("store")?.trim() ?? "";
  const publishedFrom = search.get("publishedFrom")?.trim() ?? "";
  const publishedTo = search.get("publishedTo")?.trim() ?? "";
  const stockMin = search.get("stockMin")?.trim() ?? "";
  const stockMax = search.get("stockMax")?.trim() ?? "";
  const sortRaw = search.get("sort")?.trim() ?? "";
  const sortDirRaw = search.get("sortDir")?.trim().toLowerCase() ?? "";
  const pageRaw = Number(search.get("page") ?? "1");
  const pageSizeRaw = Number(search.get("pageSize") ?? "20");

  const sort = isSort(sortRaw) ? sortRaw : undefined;
  const sortDir: AdminAdvertisementSortDir | undefined =
    sortDirRaw === "asc" || sortDirRaw === "desc" ? sortDirRaw : undefined;

  return {
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(city ? { city } : {}),
    ...(state ? { state: state.toUpperCase() } : {}),
    ...(store ? { store } : {}),
    ...(publishedFrom ? { publishedFrom } : {}),
    ...(publishedTo ? { publishedTo } : {}),
    ...(stockMin ? { stockMin } : {}),
    ...(stockMax ? { stockMax } : {}),
    ...(sort ? { sort } : {}),
    ...(sortDir ? { sortDir } : {}),
    ...(Number.isFinite(pageRaw) && pageRaw > 1
      ? { page: Math.floor(pageRaw) }
      : {}),
    ...(Number.isFinite(pageSizeRaw) && pageSizeRaw !== 20 && pageSizeRaw > 0
      ? { pageSize: Math.min(100, Math.floor(pageSizeRaw)) }
      : {}),
  };
}

/**
 * Monta href de `/admin/anuncios` (URL fonte da verdade).
 */
export function buildAdminAdvertisementsHref(
  filters: AdminAdvertisementsUrlFilters = {},
): string {
  const params = new URLSearchParams();

  const q = normalizeSearchQuery(filters.q ?? "");
  if (q) params.set("q", q);
  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }
  if (filters.categoryId) {
    params.set("categoryId", String(filters.categoryId));
  }
  if (filters.city?.trim()) params.set("city", filters.city.trim());
  if (filters.state?.trim()) {
    params.set("state", filters.state.trim().toUpperCase());
  }
  if (filters.store?.trim()) params.set("store", filters.store.trim());
  if (filters.publishedFrom?.trim()) {
    params.set("publishedFrom", filters.publishedFrom.trim());
  }
  if (filters.publishedTo?.trim()) {
    params.set("publishedTo", filters.publishedTo.trim());
  }
  if (filters.stockMin?.trim()) params.set("stockMin", filters.stockMin.trim());
  if (filters.stockMax?.trim()) params.set("stockMax", filters.stockMax.trim());
  if (filters.sort && filters.sort !== "newest") {
    params.set("sort", filters.sort);
  }
  if (
    filters.sortDir &&
    filters.sortDir !== "desc" &&
    filters.sort !== "oldest" &&
    filters.sort !== "newest"
  ) {
    params.set("sortDir", filters.sortDir);
  }
  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }
  if (filters.pageSize && filters.pageSize !== 20) {
    params.set("pageSize", String(filters.pageSize));
  }

  const query = params.toString();
  return query
    ? `${ROUTES.ADMIN_ADVERTISEMENTS}?${query}`
    : ROUTES.ADMIN_ADVERTISEMENTS;
}

export function toAdminAdvertisementsApiParams(
  filters: AdminAdvertisementsUrlFilters,
): AdminAdvertisementsListParams {
  const stockMin = filters.stockMin ? Number(filters.stockMin) : NaN;
  const stockMax = filters.stockMax ? Number(filters.stockMax) : NaN;

  return {
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.city ? { city: filters.city } : {}),
    ...(filters.state ? { state: filters.state } : {}),
    ...(filters.store ? { store: filters.store } : {}),
    ...(filters.publishedFrom
      ? { publishedFrom: filters.publishedFrom }
      : {}),
    ...(filters.publishedTo ? { publishedTo: filters.publishedTo } : {}),
    ...(!Number.isNaN(stockMin) ? { stockMin } : {}),
    ...(!Number.isNaN(stockMax) ? { stockMax } : {}),
    sort: filters.sort ?? "newest",
    sortDir:
      filters.sortDir ??
      (filters.sort === "title" ||
      filters.sort === "store" ||
      filters.sort === "oldest"
        ? "asc"
        : "desc"),
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 20,
  };
}

export function adminAdvertisementHasActiveFilters(
  filters: AdminAdvertisementsUrlFilters,
): boolean {
  return Boolean(
    filters.q ||
      filters.status ||
      filters.categoryId ||
      filters.city ||
      filters.state ||
      filters.store ||
      filters.publishedFrom ||
      filters.publishedTo ||
      filters.stockMin ||
      filters.stockMax,
  );
}
