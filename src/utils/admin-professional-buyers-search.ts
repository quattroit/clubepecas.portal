import { ROUTES } from "@/constants/routes";
import type {
  ListProfessionalBuyersParams,
  ProfessionalBuyerSortParam,
  ProfessionalBuyerStatusFilter,
} from "@/contracts/professional-buyers";
import { normalizeSearchQuery } from "@/utils/marketplace-search";

export type AdminProfessionalBuyersUrlFilters = {
  q?: string;
  status?: ProfessionalBuyerStatusFilter;
  sort?: ProfessionalBuyerSortParam;
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
};

const SORT_VALUES: ProfessionalBuyerSortParam[] = [
  "createdAt",
  "companyName",
  "corporateName",
  "contactName",
  "email",
  "status",
];

function isSort(value: string): value is ProfessionalBuyerSortParam {
  return SORT_VALUES.includes(value as ProfessionalBuyerSortParam);
}

function parseStatus(
  value: string | null,
): ProfessionalBuyerStatusFilter | undefined {
  if (!value || value === "all") return undefined;
  if (value === "pending" || value === "active" || value === "suspended") {
    return value;
  }
  return undefined;
}

function parsePositiveInt(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return undefined;
  return parsed;
}

export function parseAdminProfessionalBuyersFilters(
  params: URLSearchParams | string | null | undefined,
): AdminProfessionalBuyersUrlFilters {
  const search =
    typeof params === "string"
      ? new URLSearchParams(params)
      : (params ?? new URLSearchParams());

  const q = normalizeSearchQuery(search.get("q") ?? "");
  const status = parseStatus(search.get("status"));
  const sortRaw = search.get("sort")?.trim() ?? "";
  const sortDescRaw = search.get("sortDescending")?.trim().toLowerCase() ?? "";
  const page = parsePositiveInt(search.get("page"));
  const pageSize = parsePositiveInt(search.get("pageSize"));

  const sort = isSort(sortRaw) ? sortRaw : undefined;
  const sortDescending =
    sortDescRaw === "true"
      ? true
      : sortDescRaw === "false"
        ? false
        : undefined;

  return {
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    ...(sort ? { sort } : {}),
    ...(sortDescending !== undefined ? { sortDescending } : {}),
    ...(page && page > 1 ? { page } : {}),
    ...(pageSize && pageSize !== 20 ? { pageSize } : {}),
  };
}

export function buildAdminProfessionalBuyersHref(
  filters: AdminProfessionalBuyersUrlFilters = {},
): string {
  const params = new URLSearchParams();

  const q = normalizeSearchQuery(filters.q ?? "");
  if (q) params.set("q", q);
  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }
  if (filters.sort && filters.sort !== "createdAt") {
    params.set("sort", filters.sort);
  }
  if (filters.sortDescending === false) {
    params.set("sortDescending", "false");
  }
  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }
  if (filters.pageSize && filters.pageSize !== 20) {
    params.set("pageSize", String(filters.pageSize));
  }

  const query = params.toString();
  return query
    ? `${ROUTES.ADMIN_PROFESSIONAL_BUYERS}?${query}`
    : ROUTES.ADMIN_PROFESSIONAL_BUYERS;
}

export function toAdminProfessionalBuyersApiParams(
  filters: AdminProfessionalBuyersUrlFilters,
): ListProfessionalBuyersParams {
  return {
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 20,
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.status && filters.status !== "all"
      ? { status: filters.status }
      : {}),
    sort: filters.sort ?? "createdAt",
    sortDescending: filters.sortDescending ?? true,
  };
}

export function adminProfessionalBuyersHasActiveFilters(
  filters: AdminProfessionalBuyersUrlFilters,
): boolean {
  return Boolean(filters.q || filters.status);
}
