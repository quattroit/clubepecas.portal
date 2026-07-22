import type {
  PayoutPaymentMethod,
  PayoutStatus,
} from "@/contracts/common/enums";

/**
 * Pagamentos de comissões a representantes (Sprint 10.7).
 * Agrupa uma ou mais comissões aprovadas em uma liquidação financeira.
 */

export type AdminPayoutStatusFilter = "all" | "Pending" | "Paid" | "Cancelled";

export type AdminPayoutsListParams = {
  page?: number;
  pageSize?: number;
  representativeId?: number;
  status?: AdminPayoutStatusFilter;
};

export type AdminPayoutSummaryDto = {
  pendingCount: number;
  paidCount: number;
  paidAmount: number;
  pendingAmount: number;
};

export type AdminPayoutListItemDto = {
  id: number;
  representativeId: number;
  representativeName: string;
  representativeCode: string;
  referenceStart: string;
  referenceEnd: string;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  currency: string;
  paymentMethod: PayoutPaymentMethod;
  paymentMethodLabel: string;
  status: PayoutStatus;
  statusLabel: string;
  paidAt: string | null;
  createdAt: string;
  itemCount: number;
};

export type AdminPayoutsListResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  summary: AdminPayoutSummaryDto;
  items: AdminPayoutListItemDto[];
};

export type AdminPayoutCommissionItemDto = {
  id: number;
  representativeId: number;
  sellerId: number;
  sellerStoreName: string;
  commissionType: number | string;
  commissionTypeLabel: string;
  commissionAmount: number;
  currency: string;
  referenceMonth: string;
  generatedAt: string;
};

export type AdminPayoutDetailDto = AdminPayoutListItemDto & {
  notes: string | null;
  transactionReference: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  updatedAt: string | null;
  commissions: AdminPayoutCommissionItemDto[];
};

/** POST /api/v1/admin/payouts */
export type CreateAdminPayoutRequest = {
  commissionIds: number[];
  discountAmount?: number;
  notes?: string;
  paymentMethod?: string;
};

/** POST /api/v1/admin/payouts/{id}/pay */
export type PayAdminPayoutRequest = {
  transactionReference?: string;
  notes?: string;
};

/** POST /api/v1/admin/payouts/{id}/cancel */
export type CancelAdminPayoutRequest = {
  reason?: string;
};

export function isPayoutStatus(
  status: PayoutStatus | number,
  expected: "Pending" | "Paid" | "Cancelled",
): boolean {
  const map = { Pending: 1, Paid: 2, Cancelled: 3 } as const;
  return status === map[expected];
}
