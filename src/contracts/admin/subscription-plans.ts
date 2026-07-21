import type { BillingCycle } from "@/contracts/common/enums";

/** Query params de GET /api/v1/admin/subscription-plans (opcional — filtro pode ser client-side). */
export type AdminSubscriptionPlansListParams = {
  q?: string;
};

/** Preço de um plano para um ciclo de cobrança específico — visão administrativa. */
export type AdminSubscriptionPlanPriceDto = {
  id: number;
  billingCycle: BillingCycle;
  billingCycleLabel: string;
  price: number;
  currency: string;
  displayName?: string | null;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
  equivalentMonthlyPrice: number;
  savingsAmount?: number | null;
  savingsPercent?: number | null;
  isRecommended: boolean;
};

export type AdminSubscriptionPlanListItemDto = {
  id: number;
  name: string;
  description?: string | null;
  advertisementLimit: number;
  displayOrder: number;
  isActive: boolean;
  slug?: string | null;
  /** Menor preço entre os ciclos ativos — usado como resumo na listagem. */
  startingPrice: number;
  currency: string;
  prices: AdminSubscriptionPlanPriceDto[];
};

/** GET /api/v1/admin/subscription-plans/{id} */
export type AdminSubscriptionPlanDetailDto = AdminSubscriptionPlanListItemDto;

export type GetAdminSubscriptionPlansResponse = {
  items: AdminSubscriptionPlanListItemDto[];
};

/**
 * Item do array `prices` no payload de criação/edição.
 * `id` presente = atualiza o preço existente; ausente = cria um novo ciclo.
 */
export type AdminSubscriptionPlanPriceRequest = {
  id?: number;
  billingCycle: BillingCycle;
  price: number;
  displayName?: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  isRecommended: boolean;
};

/** POST /api/v1/admin/subscription-plans */
export type CreateAdminSubscriptionPlanRequest = {
  name: string;
  description?: string;
  advertisementLimit: number;
  displayOrder?: number;
  isActive: boolean;
  prices: AdminSubscriptionPlanPriceRequest[];
};

/** PUT /api/v1/admin/subscription-plans/{id} */
export type UpdateAdminSubscriptionPlanRequest = {
  name: string;
  description?: string;
  advertisementLimit: number;
  displayOrder: number;
  isActive: boolean;
  prices: AdminSubscriptionPlanPriceRequest[];
};
