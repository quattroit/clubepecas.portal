import type {
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
} from "@/contracts/common/enums";

export type AdminPaymentListItemDto = {
  id: number;
  sellerId: number;
  sellerName: string;
  subscriptionPlanId?: number | null;
  planName?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  provider: PaymentProvider;
  dueDateUtc?: string | null;
  paidAtUtc?: string | null;
  nextBillingDateUtc?: string | null;
  externalPaymentId?: string | null;
  lastWebhookAtUtc?: string | null;
  lastWebhookProcessedAtUtc?: string | null;
  lastWebhookEventType?: string | null;
};

export type ListAdminPaymentsResponse = {
  items: AdminPaymentListItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type ListAdminPaymentsParams = {
  page?: number;
  pageSize?: number;
  status?: PaymentStatus;
  search?: string;
};

export type SyncAdminPaymentResponse = {
  paymentId: number;
  paymentStatus: string;
  subscriptionId?: number | null;
  subscriptionStatus?: string | null;
  message?: string | null;
};
