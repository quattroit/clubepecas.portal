import type {
  SubscriptionPlanCatalogItemDto,
  SubscriptionPlanPriceDto,
} from "@/contracts/seller/subscription";
import { BillingCycle } from "@/contracts/common/enums";
import { billingCycleSuffix } from "@/utils/billingCycle";
import { formatCurrency } from "@/utils/formatCurrency";

/** Preço de um ciclo: "R$ XX,XX / mês", "/ trimestre" ou "/ ano". */
export function formatPlanPrice(
  price: number,
  cycle: BillingCycle = BillingCycle.Monthly,
): string {
  return `${formatCurrency(price)} / ${billingCycleSuffix(cycle)}`;
}

/** Limite: "XX anúncios" ou "Anúncios ilimitados" quando 0. */
export function formatPlanAdvertisementLimit(limit: number): string {
  if (limit === 0) {
    return "Anúncios ilimitados";
  }
  return `${limit} anúncios`;
}

/**
 * Preços de um plano ordenados por `displayOrder` (fonte da verdade: API).
 */
export function sortPlanPrices(
  prices: readonly SubscriptionPlanPriceDto[],
): SubscriptionPlanPriceDto[] {
  return [...prices].sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Ciclo padrão a ser pré-selecionado: o sinalizado como recomendado pela API
 * ou, na ausência de recomendação, o primeiro por ordem de exibição.
 */
export function getDefaultPlanPrice(
  prices: readonly SubscriptionPlanPriceDto[],
): SubscriptionPlanPriceDto | null {
  if (prices.length === 0) return null;
  const sorted = sortPlanPrices(prices);
  return sorted.find((price) => price.isRecommended) ?? sorted[0];
}

/** Plano com um único ciclo mensal gratuito (sem opções de ciclo a escolher). */
export function isFreeMonthlyOnlyPlan(
  plan: Pick<SubscriptionPlanCatalogItemDto, "prices">,
): boolean {
  return (
    plan.prices.length === 1 &&
    plan.prices[0].billingCycle === BillingCycle.Monthly &&
    plan.prices[0].price === 0
  );
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
