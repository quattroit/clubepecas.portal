import type { SubscriptionPlanCatalogItemDto } from "@/contracts/seller/subscription";
import { formatCurrency } from "@/utils/formatCurrency";

/** Preço público: R$ XX,XX / mês */
export function formatPlanPrice(price: number): string {
  return `${formatCurrency(price)} / mês`;
}

/** Limite: "XX anúncios" ou "Anúncios ilimitados" quando 0. */
export function formatPlanAdvertisementLimit(limit: number): string {
  if (limit === 0) {
    return "Anúncios ilimitados";
  }
  return `${limit} anúncios`;
}

/**
 * Índice do plano intermediário para destaque visual ("Mais escolhido").
 * Retorna null se houver menos de 3 planos.
 */
export function getFeaturedPlanIndex(
  plans: readonly SubscriptionPlanCatalogItemDto[],
): number | null {
  if (plans.length < 3) {
    return null;
  }
  return Math.floor((plans.length - 1) / 2);
}
