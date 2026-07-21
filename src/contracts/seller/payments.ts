import type {
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
  PaymentType,
} from "@/contracts/common/enums";

/** GET /api/v1/seller/payments — item do histórico financeiro. */
export type SellerPaymentDto = {
  id: number;
  subscriptionId?: number | null;
  subscriptionPlanId?: number | null;
  planName?: string | null;
  type: PaymentType;
  status: PaymentStatus;
  method: PaymentMethod;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  description?: string | null;
  reference?: string | null;
  dueDateUtc?: string | null;
  paidAtUtc?: string | null;
  createdAtUtc: string;
};

export type ListSellerPaymentsResponse = {
  items: SellerPaymentDto[];
};
