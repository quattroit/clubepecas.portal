import { ROUTES } from "@/constants/routes";
import type { AdminAuditListParams } from "@/contracts/admin/audit";

export type AdminAuditSuccessFilter = "all" | "true" | "false";

export type AdminAuditUrlFilters = {
  from?: string;
  to?: string;
  action?: string;
  success?: Exclude<AdminAuditSuccessFilter, "all">;
  page?: number;
  pageSize?: number;
};

function parseSuccess(
  value: string | null,
): Exclude<AdminAuditSuccessFilter, "all"> | undefined {
  if (!value || value === "all") return undefined;
  if (value === "true" || value === "false") return value;
  return undefined;
}

/**
 * Lê filtros da querystring `/admin/auditoria`.
 */
export function parseAdminAuditFilters(
  params: URLSearchParams | string | null | undefined,
): AdminAuditUrlFilters {
  const search =
    typeof params === "string"
      ? new URLSearchParams(params)
      : (params ?? new URLSearchParams());

  const from = search.get("from")?.trim() ?? "";
  const to = search.get("to")?.trim() ?? "";
  const action = search.get("action")?.trim() ?? "";
  const success = parseSuccess(search.get("success"));
  const pageRaw = Number(search.get("page") ?? "1");
  const pageSizeRaw = Number(search.get("pageSize") ?? "20");

  return {
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
    ...(action ? { action } : {}),
    ...(success ? { success } : {}),
    ...(Number.isFinite(pageRaw) && pageRaw > 1
      ? { page: Math.floor(pageRaw) }
      : {}),
    ...(Number.isFinite(pageSizeRaw) && pageSizeRaw !== 20 && pageSizeRaw > 0
      ? { pageSize: Math.min(100, Math.floor(pageSizeRaw)) }
      : {}),
  };
}

/**
 * Monta href de `/admin/auditoria` (URL fonte da verdade).
 */
export function buildAdminAuditHref(
  filters: AdminAuditUrlFilters = {},
): string {
  const params = new URLSearchParams();

  if (filters.from?.trim()) params.set("from", filters.from.trim());
  if (filters.to?.trim()) params.set("to", filters.to.trim());
  if (filters.action?.trim()) params.set("action", filters.action.trim());
  if (filters.success) {
    params.set("success", filters.success);
  }
  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }
  if (filters.pageSize && filters.pageSize !== 20) {
    params.set("pageSize", String(filters.pageSize));
  }

  const query = params.toString();
  return query ? `${ROUTES.ADMIN_AUDIT}?${query}` : ROUTES.ADMIN_AUDIT;
}

/**
 * Converte filtros da URL nos params da API.
 */
export function toAdminAuditApiParams(
  filters: AdminAuditUrlFilters,
): AdminAuditListParams {
  return {
    ...(filters.from ? { from: filters.from } : {}),
    ...(filters.to ? { to: filters.to } : {}),
    ...(filters.action ? { action: filters.action } : {}),
    ...(filters.success === "true" ? { success: true } : {}),
    ...(filters.success === "false" ? { success: false } : {}),
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 20,
  };
}

export function adminAuditHasActiveFilters(
  filters: AdminAuditUrlFilters,
): boolean {
  return Boolean(
    filters.from || filters.to || filters.action || filters.success,
  );
}
