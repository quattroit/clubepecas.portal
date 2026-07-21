import type { BillingCycle } from "@/contracts/common/enums";

export type AdminFinancialSubscriptionsSummaryDto = {
  active: number;
  cancelled: number;
  gracePeriod: number;
  expired: number;
  pending: number;
  cancellationRequested: number;
};

export type AdminFinancialMrrDto = {
  mrr: number;
  arr: number;
  currency: string;
};

export type AdminFinancialRevenueDto = {
  month: number;
  year: number;
  currency: string;
};

export type AdminFinancialChargesSummaryDto = {
  paid: number;
  pending: number;
  overdue: number;
  cancelled: number;
};

export type AdminFinancialPlanBreakdownDto = {
  planId: number;
  planName: string;
  activeSubscriptions: number;
  revenuePaid: number;
  mrrContribution: number;
  currency: string;
};

export type AdminFinancialBillingCycleBreakdownDto = {
  billingCycle: BillingCycle;
  billingCycleLabel: string;
  activeSubscriptions: number;
  revenuePaid: number;
  mrrContribution: number;
  currency: string;
};

export type AdminFinancialIndicatorsDto = {
  averageTicket: number;
  churnRatePercent: number;
  planConversionRatePercent: number;
  delinquencyRatePercent: number;
  currency: string;
};

/** GET /api/v1/admin/financial/dashboard */
export type AdminFinancialDashboardResponse = {
  subscriptions: AdminFinancialSubscriptionsSummaryDto;
  mrr: AdminFinancialMrrDto;
  revenue: AdminFinancialRevenueDto;
  charges: AdminFinancialChargesSummaryDto;
  plans: AdminFinancialPlanBreakdownDto[];
  billingCycles: AdminFinancialBillingCycleBreakdownDto[];
  indicators: AdminFinancialIndicatorsDto;
};
