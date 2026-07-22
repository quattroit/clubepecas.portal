import type { CommissionStatus, CommissionType } from "@/contracts/admin/commissions";
import type { RepresentativeStatus } from "@/contracts/admin/representatives";
import type { PersonType } from "@/contracts/common/enums";

export type { CommissionStatus, CommissionType, RepresentativeStatus };

/** GET /api/v1/representative/me */
export type RepresentativeMeDto = {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: string;
  representativeCode: string;
  status: RepresentativeStatus;
  statusLabel: string;
  zipCode: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  lastLoginAt: string | null;
};

/** PUT /api/v1/representative/me */
export type UpdateRepresentativeMeRequest = {
  name: string;
  phone: string;
  zipCode: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
};

export type UpdateRepresentativeMeResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
  representativeCode: string;
  status: RepresentativeStatus;
  statusLabel: string;
  zipCode: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string | null;
  neighborhood: string;
  city: string;
  state: string;
};

/** PUT /api/v1/representative/me/password */
export type UpdateRepresentativeMePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type UpdateRepresentativeMePasswordResponse = {
  success: boolean;
};

/** GET /api/v1/representative/dashboard */
export type RepresentativeDashboardCommissionItemDto = {
  id: number;
  type: CommissionType;
  typeLabel: string;
  amount: number;
  status: CommissionStatus;
  statusLabel: string;
  generatedAt: string;
  referenceMonth: string;
};

export type RepresentativeDashboardSellerItemDto = {
  id: number;
  storeName: string;
  city: string;
  createdAt: string;
  isActive: boolean;
};

export type RepresentativeDashboardMonthlySummaryItemDto = {
  /** Formato yyyy-MM. */
  referenceMonth: string;
  generated: number;
  approved: number;
  paid: number;
};

export type RepresentativeDashboardResponse = {
  totalPendingCommission: number;
  totalApprovedCommission: number;
  totalPaidCommission: number;
  totalGeneratedCommission: number;
  totalSellers: number;
  activeSubscriptions: number;
  revenueGenerated: number;
  /** Percentual 0–100; null quando não há vendedores. */
  conversionRate: number | null;
  latestCommissions: RepresentativeDashboardCommissionItemDto[];
  latestSellers: RepresentativeDashboardSellerItemDto[];
  monthlySummary: RepresentativeDashboardMonthlySummaryItemDto[];
};

/** GET /api/v1/representative/sellers */
export type RepresentativeSellersStatusFilter = "all" | "active" | "inactive";

export type RepresentativeSellersListParams = {
  page?: number;
  pageSize?: number;
  name?: string;
  city?: string;
  status?: RepresentativeSellersStatusFilter;
  planName?: string;
};

export type RepresentativeSellerListItemDto = {
  id: number;
  storeName: string;
  city: string;
  state: string;
  planName: string | null;
  isActive: boolean;
  createdAt: string;
  lastSubscriptionAt: string | null;
};

export type RepresentativeSellersListResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  items: RepresentativeSellerListItemDto[];
};

/** GET /api/v1/representative/sellers/{id} */
export type RepresentativeSellerDetailDto = {
  id: number;
  storeName: string;
  displayName: string;
  description: string | null;
  city: string;
  state: string;
  zipCode: string | null;
  addressStreet: string | null;
  addressNumber: string | null;
  addressComplement: string | null;
  neighborhood: string | null;
  email: string;
  whatsApp: string;
  personType: PersonType | null;
  /** CPF/CNPJ mascarado — o vendedor não é o titular da sessão. */
  document: string | null;
  instagram: string | null;
  photoUrl: string | null;
  planName: string | null;
  isActive: boolean;
  createdAt: string;
};

/** GET /api/v1/representative/commissions */
export type RepresentativeCommissionStatusFilter =
  | "all"
  | "Pending"
  | "Approved"
  | "Paid"
  | "Cancelled";

export type RepresentativeCommissionTypeFilter =
  | "all"
  | "FirstSale"
  | "Recurring"
  | "Adjustment";

export type RepresentativeCommissionsListParams = {
  page?: number;
  pageSize?: number;
  status?: RepresentativeCommissionStatusFilter;
  type?: RepresentativeCommissionTypeFilter;
  fromUtc?: string;
  toUtc?: string;
};

export type RepresentativeCommissionListItemDto = {
  id: number;
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

export type RepresentativeCommissionsListResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  items: RepresentativeCommissionListItemDto[];
};

/** GET /api/v1/representative/commissions/{id} */
export type RepresentativeCommissionDetailDto = {
  id: number;
  sellerId: number;
  sellerStoreName: string;
  sellerSubscriptionId: number | null;
  paymentId: number;
  planName: string | null;
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
  approvedAt: string | null;
  paidAt: string | null;
  cancelledAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
};

/** GET /api/v1/representative/statement */
export type RepresentativeStatementMonthDto = {
  /** Formato yyyy-MM. */
  referenceMonth: string;
  totalGenerated: number;
  totalApproved: number;
  totalPaid: number;
  totalPending: number;
  count: number;
};

export type RepresentativeStatementResponse = {
  items: RepresentativeStatementMonthDto[];
};

/** GET /api/v1/representative/referral-link */
export type RepresentativeReferralLinkResponse = {
  representativeCode: string;
  /** Caminho relativo — o front-end monta a URL completa com o domínio atual. */
  publicPath: string;
  name: string;
};
