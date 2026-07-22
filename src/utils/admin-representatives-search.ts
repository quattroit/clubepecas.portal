import { ROUTES } from "@/constants/routes";
import type {
  AdminRepresentativeSortDir,
  AdminRepresentativeSortParam,
  AdminRepresentativeStatusFilter,
  AdminRepresentativesListParams,
} from "@/contracts/admin/representatives";
import { normalizeSearchQuery } from "@/utils/marketplace-search";

export type AdminRepresentativesUrlFilters = {
  name?: string;
  email?: string;
  code?: string;
  status?: AdminRepresentativeStatusFilter;
  sort?: AdminRepresentativeSortParam;
  sortDir?: AdminRepresentativeSortDir;
  page?: number;
  pageSize?: number;
};

const SORT_VALUES: AdminRepresentativeSortParam[] = [
  "createdAt",
  "name",
  "email",
  "code",
  "status",
];

function isSort(value: string): value is AdminRepresentativeSortParam {
  return SORT_VALUES.includes(value as AdminRepresentativeSortParam);
}

function parseStatus(
  value: string | null,
): AdminRepresentativeStatusFilter | undefined {
  if (!value || value === "all") return undefined;
  if (value === "active" || value === "inactive") return value;
  return undefined;
}

function parsePositiveInt(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return undefined;
  return parsed;
}

export function parseAdminRepresentativesFilters(
  params: URLSearchParams | string | null | undefined,
): AdminRepresentativesUrlFilters {
  const search =
    typeof params === "string"
      ? new URLSearchParams(params)
      : (params ?? new URLSearchParams());

  const name = normalizeSearchQuery(search.get("name") ?? "");
  const email = normalizeSearchQuery(search.get("email") ?? "");
  const code = normalizeSearchQuery(search.get("code") ?? "").toUpperCase();
  const status = parseStatus(search.get("status"));
  const sortRaw = search.get("sort")?.trim() ?? "";
  const sortDirRaw = search.get("sortDir")?.trim().toLowerCase() ?? "";
  const page = parsePositiveInt(search.get("page"));
  const pageSize = parsePositiveInt(search.get("pageSize"));

  const sort = isSort(sortRaw) ? sortRaw : undefined;
  const sortDir: AdminRepresentativeSortDir | undefined =
    sortDirRaw === "asc" || sortDirRaw === "desc" ? sortDirRaw : undefined;

  return {
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
    ...(code ? { code } : {}),
    ...(status ? { status } : {}),
    ...(sort ? { sort } : {}),
    ...(sortDir ? { sortDir } : {}),
    ...(page && page > 1 ? { page } : {}),
    ...(pageSize && pageSize !== 20 ? { pageSize } : {}),
  };
}

export function buildAdminRepresentativesHref(
  filters: AdminRepresentativesUrlFilters = {},
): string {
  const params = new URLSearchParams();

  const name = normalizeSearchQuery(filters.name ?? "");
  const email = normalizeSearchQuery(filters.email ?? "");
  const code = normalizeSearchQuery(filters.code ?? "").toUpperCase();

  if (name) params.set("name", name);
  if (email) params.set("email", email);
  if (code) params.set("code", code);
  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }
  if (filters.sort && filters.sort !== "createdAt") {
    params.set("sort", filters.sort);
  }
  if (filters.sortDir && filters.sortDir !== "desc") {
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
    ? `${ROUTES.ADMIN_REPRESENTATIVES}?${query}`
    : ROUTES.ADMIN_REPRESENTATIVES;
}

export function toAdminRepresentativesApiParams(
  filters: AdminRepresentativesUrlFilters,
): AdminRepresentativesListParams {
  return {
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 20,
    ...(filters.name ? { name: filters.name } : {}),
    ...(filters.email ? { email: filters.email } : {}),
    ...(filters.code ? { code: filters.code } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    sort: filters.sort ?? "createdAt",
    sortDir: filters.sortDir ?? "desc",
  };
}

export function adminRepresentativesHasActiveFilters(
  filters: AdminRepresentativesUrlFilters,
): boolean {
  return Boolean(
    filters.name || filters.email || filters.code || filters.status,
  );
}
