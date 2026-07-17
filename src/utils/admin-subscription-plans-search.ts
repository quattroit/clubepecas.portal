import { ROUTES } from "@/constants/routes";
import type { AdminSubscriptionPlanListItemDto } from "@/contracts/admin/subscription-plans";
import { normalizeSearchQuery } from "@/utils/marketplace-search";

export type AdminSubscriptionPlansUrlFilters = {
  q?: string;
};

/**
 * Lê filtros da querystring `/admin/planos`.
 */
export function parseAdminSubscriptionPlansFilters(
  params: URLSearchParams | string | null | undefined,
): AdminSubscriptionPlansUrlFilters {
  const search =
    typeof params === "string"
      ? new URLSearchParams(params)
      : (params ?? new URLSearchParams());

  const q = normalizeSearchQuery(search.get("q") ?? "");

  return {
    ...(q ? { q } : {}),
  };
}

/**
 * Monta href de `/admin/planos` (URL fonte da verdade).
 */
export function buildAdminSubscriptionPlansHref(
  filters: AdminSubscriptionPlansUrlFilters = {},
): string {
  const params = new URLSearchParams();

  const q = normalizeSearchQuery(filters.q ?? "");
  if (q) params.set("q", q);

  const query = params.toString();
  return query ? `${ROUTES.ADMIN_PLANS}?${query}` : ROUTES.ADMIN_PLANS;
}

export function adminSubscriptionPlansHasActiveFilters(
  filters: AdminSubscriptionPlansUrlFilters,
): boolean {
  return Boolean(filters.q);
}

/**
 * Filtro client-side por nome (e slug, se houver).
 */
export function filterAdminSubscriptionPlans(
  items: AdminSubscriptionPlanListItemDto[],
  filters: AdminSubscriptionPlansUrlFilters,
): AdminSubscriptionPlanListItemDto[] {
  const q = normalizeSearchQuery(filters.q ?? "").toLowerCase();
  if (!q) {
    return [...items].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  return items
    .filter((item) => {
      const name = item.name.toLowerCase();
      const slug = (item.slug ?? "").toLowerCase();
      return name.includes(q) || slug.includes(q);
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);
}
