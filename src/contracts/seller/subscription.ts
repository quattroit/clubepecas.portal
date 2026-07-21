import type {
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
};

/** GET /api/v1/seller/subscriptions */
export type SellerSubscriptionListItemDto = SellerSubscriptionDto;

export type ListSellerSubscriptionsResponse = {
  items: SellerSubscriptionListItemDto[];
};

/** POST /api/v1/seller/subscription */
export type CreateSellerSubscriptionRequest = {
  subscriptionPlanId: number;
};

/** POST /api/v1/seller/subscription/checkout */
export type CreateSellerSubscriptionCheckoutRequest = {
  subscriptionPlanId: number;
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

/** GET /api/v1/subscription-plans — catálogo público (apenas ativos). */
export type SubscriptionPlanCatalogItemDto = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  advertisementLimit: number;
  displayOrder: number;
};

export type ListSubscriptionPlansResponse = {
  items: SubscriptionPlanCatalogItemDto[];
};
