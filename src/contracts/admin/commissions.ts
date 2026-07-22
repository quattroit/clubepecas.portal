export type CommissionStatus =
  | "Pending"
  | "Approved"
  | "Paid"
  | "Cancelled"
  | 1
  | 2
  | 3
  | 4;

export type CommissionType =
  | "FirstSale"
  | "Recurring"
  | "Adjustment"
  | 1
  | 2
  | 3;

export type AdminCommissionStatusFilter =
  | "all"
  | "Pending"
  | "Approved"
  | "Paid"
  | "Cancelled";

export type AdminCommissionTypeFilter =
  | "all"
  | "FirstSale"
  | "Recurring"
  | "Adjustment";

export type AdminCommissionsListParams = {
  page?: number;
  pageSize?: number;
  representativeId?: number;
  sellerId?: number;
  status?: AdminCommissionStatusFilter;
  type?: AdminCommissionTypeFilter;
  fromUtc?: string;
  toUtc?: string;
  referenceMonth?: string;
  sort?: string;
  sortDir?: "asc" | "desc";
};

export type AdminCommissionSummaryDto = {
  totalCommissionAmount: number;
  pendingAmount: number;
  approvedAmount: number;
  paidAmount: number;
  representativesWithCommission: number;
};

export type AdminCommissionListItemDto = {
  id: number;
  representativeId: number;
  representativeName: string;
  representativeCode: string;
  sellerId: number;
  sellerStoreName: string;
  commissionType: CommissionType;
  commissionTypeLabel: string;
  commissionStatus: CommissionStatus;
  commissionStatusLabel: string;
  baseAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  currency: string;
  referenceMonth: string;
  generatedAt: string;
};

export type AdminCommissionsListResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  summary: AdminCommissionSummaryDto;
  items: AdminCommissionListItemDto[];
};

export type AdminCommissionDetailDto = {
  id: number;
  representativeId: number;
  representativeName: string;
  representativeCode: string;
  sellerId: number;
  sellerStoreName: string;
  sellerSubscriptionId?: number | null;
  paymentId: number;
  planName?: string | null;
  commissionType: CommissionType;
  commissionTypeLabel: string;
  commissionStatus: CommissionStatus;
  commissionStatusLabel: string;
  baseAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  currency: string;
  referenceMonth: string;
  generatedAt: string;
  approvedAt?: string | null;
  paidAt?: string | null;
  cancelledAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

export type CancelAdminCommissionRequest = {
  reason: string;
};

export function isCommissionStatus(
  status: CommissionStatus,
  expected: "Pending" | "Approved" | "Paid" | "Cancelled",
): boolean {
  const map = { Pending: 1, Approved: 2, Paid: 3, Cancelled: 4 } as const;
  return status === expected || status === map[expected];
}
