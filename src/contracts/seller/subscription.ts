import type { SellerSubscriptionStatus } from "@/contracts/common/enums";

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
