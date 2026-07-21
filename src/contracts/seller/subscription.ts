import type {
  BillingCycle,
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
  PaymentType,
  SellerSubscriptionStatus,
} from "@/contracts/common/enums";

/** Cores semânticas retornadas pela API (Sprint 8.4). */
export type SubscriptionStatusColor =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";

export type SubscriptionPlanSummaryDto = {
  id: number;
  name: string;
  description?: string | null;
  advertisementLimit: number;
  advertisementsUsed: number;
  advertisementsRemaining: number;
  quotaUsagePercent: number;
  isUnlimited: boolean;
};

export type SubscriptionPaymentSnapshotDto = {
  id: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  statusLabel: string;
  billingCycle: BillingCycle;
  dueDateUtc?: string | null;
  paidAtUtc?: string | null;
  method: PaymentMethod;
};

export type SubscriptionFinancialSummaryDto = {
  lastPayment?: SubscriptionPaymentSnapshotDto | null;
  nextPayment?: SubscriptionPaymentSnapshotDto | null;
  amount?: number | null;
  currency?: string | null;
  paymentStatus?: PaymentStatus | null;
  paymentStatusLabel?: string | null;
  hasPendingPayment: boolean;
  hasOverduePayment: boolean;
};

export type SubscriptionIndicatorsDto = {
  quotaUsagePercent: number;
  subscriptionStatus: SellerSubscriptionStatus;
  subscriptionStatusColor: SubscriptionStatusColor;
  paymentStatus?: PaymentStatus | null;
  paymentStatusColor?: SubscriptionStatusColor | null;
  remainingDays?: number | null;
  isNearExpiration: boolean;
  isGracePeriod: boolean;
  hasPendingPayment: boolean;
};

export type SubscriptionTimelineItemDto = {
  occurredAtUtc: string;
  type: string;
  description: string;
  status: string;
};

export type SubscriptionAvailableActionsDto = {
  canUpgrade: boolean;
  canDowngrade: boolean;
  canCancel: boolean;
  canReactivate: boolean;
  canRetryPayment: boolean;
  canSyncPayment: boolean;
};

export type SubscriptionAvailablePlanCycleDto = {
  billingCycle: BillingCycle;
  billingCycleLabel: string;
  price: number;
  currency: string;
  equivalentMonthlyPrice: number;
  savingsAmount?: number | null;
  savingsPercent?: number | null;
  isRecommended: boolean;
};

export type SubscriptionAvailablePlanDto = {
  id: number;
  name: string;
  description?: string | null;
  advertisementLimit: number;
  isUpgrade: boolean;
  isDowngrade: boolean;
  isAvailable: boolean;
  isCurrent: boolean;
  billingCycles: SubscriptionAvailablePlanCycleDto[];
};

/**
 * GET /api/v1/seller/subscription — Central de Gestão (Sprint 8.4).
 * Compat fields flat mantidos pelo backend para consumidores legados.
 */
export type SellerSubscriptionDto = {
  id: number;
  status: SellerSubscriptionStatus;
  statusLabel: string;
  billingCycle: BillingCycle;
  billingCycleLabel: string;
  recurringAmount: number;
  currency: string;
  equivalentMonthlyPrice?: number | null;
  contractedAtUtc: string;
  periodStartUtc: string;
  periodEndUtc?: string | null;
  nextBillingDateUtc?: string | null;
  remainingDays?: number | null;
  isGracePeriod: boolean;
  gracePeriodUntilUtc?: string | null;
  autoRenew: boolean;
  plan: SubscriptionPlanSummaryDto;
  financial: SubscriptionFinancialSummaryDto;
  indicators: SubscriptionIndicatorsDto;
  messages: string[];
  timeline: SubscriptionTimelineItemDto[];
  actions: SubscriptionAvailableActionsDto;
  availablePlans: SubscriptionAvailablePlanDto[];

  // Compatibilidade Sprint 8.3.1
  subscriptionPlanId: number;
  planName: string;
  planDescription?: string | null;
  price: number;
  advertisementLimit: number;
  advertisementsUsed: number;
  advertisementsRemaining: number;
  startDate: string;
  endDate?: string | null;
  currentPaymentId?: number | null;
  activatedAtUtc?: string | null;
  currentPaymentStatus?: PaymentStatus | null;
  currentPaymentMethod?: PaymentMethod | null;
  currentPaymentAmount?: number | null;
  currentPaymentCurrency?: string | null;
  currentPaymentBillingCycle?: BillingCycle | null;
};

/** GET /api/v1/seller/subscription/payments */
export type SubscriptionPaymentDto = {
  id: number;
  createdAtUtc: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  billingCycleLabel: string;
  status: PaymentStatus;
  statusLabel: string;
  type: PaymentType;
  dueDateUtc?: string | null;
  paidAtUtc?: string | null;
  method: PaymentMethod;
  methodLabel: string;
  invoiceUrl?: string | null;
  receiptUrl?: string | null;
  description?: string | null;
};

export type ListSellerSubscriptionPaymentsResponse = {
  items: SubscriptionPaymentDto[];
};

/** GET /api/v1/seller/subscription/history */
export type SubscriptionHistoryItemDto = {
  occurredAtUtc: string;
  type: string;
  description: string;
  source: string;
  success: boolean;
};

export type ListSellerSubscriptionHistoryResponse = {
  items: SubscriptionHistoryItemDto[];
};

/** GET /api/v1/seller/subscriptions — histórico de vínculos (contrato legado). */
export type SellerSubscriptionListItemDto = {
  id: number;
  subscriptionPlanId: number;
  planName: string;
  planDescription?: string | null;
  price: number;
  advertisementLimit: number;
  status: SellerSubscriptionStatus;
  startDate: string;
  endDate?: string | null;
};

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
  equivalentMonthlyPrice: number;
  savingsAmount?: number | null;
  savingsPercent?: number | null;
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
  startingPrice: number;
  currency: string;
  prices: SubscriptionPlanPriceDto[];
};

export type ListSubscriptionPlansResponse = {
  items: SubscriptionPlanCatalogItemDto[];
};
