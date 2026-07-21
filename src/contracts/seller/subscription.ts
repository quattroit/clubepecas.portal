import type {
  BillingCycle,
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
  SellerSubscriptionStatus,
} from "@/contracts/common/enums";

/** GET/POST/DELETE /api/v1/seller/subscription */
export type SellerSubscriptionDto = {
  id: number;
  subscriptionPlanId: number;
  planName: string;
  planDescription?: string | null;
  price: number;
  /** Ciclo de cobrança contratado (Sprint 8.3.1). */
  billingCycle: BillingCycle;
  billingCycleLabel: string;
  /** Preço equivalente mensal para comparação entre ciclos. */
  equivalentMonthlyPrice: number;
  currency: string;
  advertisementLimit: number;
  advertisementsUsed: number;
  advertisementsRemaining: number;
  status: SellerSubscriptionStatus;
  startDate: string;
  endDate?: string | null;
  currentPaymentId?: number | null;
  nextBillingDateUtc?: string | null;
  activatedAtUtc?: string | null;
  autoRenew?: boolean;
  gracePeriodUntilUtc?: string | null;
  currentPaymentStatus?: PaymentStatus | null;
  currentPaymentMethod?: PaymentMethod | null;
  currentPaymentAmount?: number | null;
  currentPaymentCurrency?: string | null;
  /** Ciclo de cobrança do pagamento atual (pode diferir do ciclo vigente em trocas de plano). */
  currentPaymentBillingCycle?: BillingCycle | null;
};

/** GET /api/v1/seller/subscriptions */
export type SellerSubscriptionListItemDto = SellerSubscriptionDto;

export type ListSellerSubscriptionsResponse = {
  items: SellerSubscriptionListItemDto[];
};

/** POST /api/v1/seller/subscription */
export type CreateSellerSubscriptionRequest = {
  subscriptionPlanId: number;
  billingCycle: BillingCycle;
};

/** POST /api/v1/seller/subscription/checkout */
export type CreateSellerSubscriptionCheckoutRequest = {
  subscriptionPlanId: number;
  billingCycle: BillingCycle;
  successUrl: string;
  cancelUrl: string;
  expiredUrl?: string;
};

export type CreateSellerSubscriptionCheckoutResponse = {
  checkoutUrl?: string | null;
  expiresAtUtc?: string | null;
  paymentId: number;
  subscriptionId: number;
  externalCustomerId?: string | null;
  externalCheckoutId?: string | null;
  externalSubscriptionId?: string | null;
  provider: PaymentProvider;
  reusedExistingCheckout: boolean;
  /** True quando o plano é R$ 0 e a assinatura foi ativada sem Asaas. */
  activatedWithoutCheckout: boolean;
};

/**
 * Preço de um plano para um ciclo de cobrança específico (Sprint 8.3.1).
 * Todos os valores (inclusive economia) vêm calculados pela API.
 */
export type SubscriptionPlanPriceDto = {
  id: number;
  billingCycle: BillingCycle;
  billingCycleLabel: string;
  price: number;
  currency: string;
  displayName?: string | null;
  description?: string | null;
  displayOrder: number;
  /** Preço equivalente mensal, para comparação entre ciclos. */
  equivalentMonthlyPrice: number;
  /** Economia em relação ao ciclo mensal — vem pronta da API, nunca calculada no cliente. */
  savingsAmount?: number | null;
  savingsPercent?: number | null;
  /** Ciclo com melhor custo-benefício, sinalizado pela API. */
  isRecommended: boolean;
};

/** GET /api/v1/subscription-plans — catálogo público (apenas ativos). */
export type SubscriptionPlanCatalogItemDto = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  advertisementLimit: number;
  displayOrder: number;
  /** Menor preço entre os ciclos disponíveis — usado para "a partir de". */
  startingPrice: number;
  currency: string;
  prices: SubscriptionPlanPriceDto[];
};

export type ListSubscriptionPlansResponse = {
  items: SubscriptionPlanCatalogItemDto[];
};
