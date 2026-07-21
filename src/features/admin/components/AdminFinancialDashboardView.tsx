"use client";

import {
  AlertCircle,
  BarChart3,
  CreditCard,
  DollarSign,
  LineChart,
  Receipt,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  AdminMetricCard,
  AdminMetricCardSkeleton,
  AdminPage,
  AdminSection,
  AdminStatsGrid,
  AdminTable,
  AdminTableSkeleton,
} from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type {
  AdminFinancialBillingCycleBreakdownDto,
  AdminFinancialPlanBreakdownDto,
} from "@/contracts/admin/financial";
import { useAdminFinancialDashboard } from "@/hooks/api/useAdminFinancialDashboard";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { formatConversionRate, formatMetricCount } from "@/utils/formatMetrics";
import { formatCurrency } from "@/utils/formatCurrency";

function formatMoney(value: number, _currency?: string): string {
  return formatCurrency(value);
}

const planColumns: AdminTableColumn<AdminFinancialPlanBreakdownDto>[] = [
  {
    id: "plan",
    header: "Plano",
    accessor: (row) => row.planName,
  },
  {
    id: "active",
    header: "Assinaturas ativas",
    cell: (row) => formatMetricCount(row.activeSubscriptions),
  },
  {
    id: "revenue",
    header: "Receita paga",
    cell: (row) => formatMoney(row.revenuePaid, row.currency),
  },
  {
    id: "mrr",
    header: "Contribuição MRR",
    cell: (row) => formatMoney(row.mrrContribution, row.currency),
  },
];

const billingCycleColumns: AdminTableColumn<AdminFinancialBillingCycleBreakdownDto>[] =
  [
    {
      id: "cycle",
      header: "Ciclo",
      accessor: (row) => row.billingCycleLabel,
    },
    {
      id: "active",
      header: "Assinaturas ativas",
      cell: (row) => formatMetricCount(row.activeSubscriptions),
    },
    {
      id: "revenue",
      header: "Receita paga",
      cell: (row) => formatMoney(row.revenuePaid, row.currency),
    },
    {
      id: "mrr",
      header: "Contribuição MRR",
      cell: (row) => formatMoney(row.mrrContribution, row.currency),
    },
  ];

function AdminFinancialDashboardView() {
  const dashboardQuery = useAdminFinancialDashboard();
  const data = dashboardQuery.data;

  return (
    <AdminPage
      title="Financeiro"
      description="Indicadores de receita, assinaturas e cobranças da plataforma."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Financeiro" },
      ]}
      actions={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void dashboardQuery.refetch()}
          disabled={dashboardQuery.isFetching}
        >
          <RefreshCw
            className={dashboardQuery.isFetching ? "animate-spin" : undefined}
            aria-hidden
          />
          Atualizar
        </Button>
      }
    >
      {dashboardQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar o dashboard financeiro"
          message={getFriendlyErrorMessage(dashboardQuery.error)}
        />
      ) : null}

      <AdminSection title="Receita recorrente">
        <AdminStatsGrid>
          {dashboardQuery.isLoading ? (
            <>
              <AdminMetricCardSkeleton />
              <AdminMetricCardSkeleton />
              <AdminMetricCardSkeleton />
              <AdminMetricCardSkeleton />
            </>
          ) : (
            <>
              <AdminMetricCard
                title="MRR"
                value={formatMoney(data?.mrr.mrr ?? 0, data?.mrr.currency)}
                description="Receita recorrente mensal"
                icon={<TrendingUp aria-hidden />}
              />
              <AdminMetricCard
                title="ARR"
                value={formatMoney(data?.mrr.arr ?? 0, data?.mrr.currency)}
                description="Receita recorrente anualizada"
                icon={<LineChart aria-hidden />}
              />
              <AdminMetricCard
                title="Receita do mês"
                value={formatMoney(
                  data?.revenue.month ?? 0,
                  data?.revenue.currency,
                )}
                description="Pagamentos confirmados no mês"
                icon={<DollarSign aria-hidden />}
              />
              <AdminMetricCard
                title="Receita do ano"
                value={formatMoney(
                  data?.revenue.year ?? 0,
                  data?.revenue.currency,
                )}
                description="Pagamentos confirmados no ano"
                icon={<BarChart3 aria-hidden />}
              />
            </>
          )}
        </AdminStatsGrid>
      </AdminSection>

      <AdminSection title="Assinaturas">
        <AdminStatsGrid aria-label="Assinaturas">
          {dashboardQuery.isLoading ? (
            <>
              <AdminMetricCardSkeleton />
              <AdminMetricCardSkeleton />
              <AdminMetricCardSkeleton />
              <AdminMetricCardSkeleton />
              <AdminMetricCardSkeleton />
              <AdminMetricCardSkeleton />
            </>
          ) : (
            <>
              <AdminMetricCard
                title="Ativas"
                value={formatMetricCount(data?.subscriptions.active ?? 0)}
                icon={<Users aria-hidden />}
              />
              <AdminMetricCard
                title="Pendentes"
                value={formatMetricCount(data?.subscriptions.pending ?? 0)}
                icon={<CreditCard aria-hidden />}
              />
              <AdminMetricCard
                title="Período de carência"
                value={formatMetricCount(data?.subscriptions.gracePeriod ?? 0)}
                icon={<AlertCircle aria-hidden />}
              />
              <AdminMetricCard
                title="Cancelamento solicitado"
                value={formatMetricCount(
                  data?.subscriptions.cancellationRequested ?? 0,
                )}
              />
              <AdminMetricCard
                title="Canceladas"
                value={formatMetricCount(data?.subscriptions.cancelled ?? 0)}
              />
              <AdminMetricCard
                title="Expiradas"
                value={formatMetricCount(data?.subscriptions.expired ?? 0)}
              />
            </>
          )}
        </AdminStatsGrid>
      </AdminSection>

      <AdminSection title="Cobranças">
        <AdminStatsGrid>
          {dashboardQuery.isLoading ? (
            <>
              <AdminMetricCardSkeleton />
              <AdminMetricCardSkeleton />
              <AdminMetricCardSkeleton />
              <AdminMetricCardSkeleton />
            </>
          ) : (
            <>
              <AdminMetricCard
                title="Pagas"
                value={formatMetricCount(data?.charges.paid ?? 0)}
                icon={<Receipt aria-hidden />}
              />
              <AdminMetricCard
                title="Pendentes"
                value={formatMetricCount(data?.charges.pending ?? 0)}
              />
              <AdminMetricCard
                title="Vencidas"
                value={formatMetricCount(data?.charges.overdue ?? 0)}
              />
              <AdminMetricCard
                title="Canceladas"
                value={formatMetricCount(data?.charges.cancelled ?? 0)}
              />
            </>
          )}
        </AdminStatsGrid>
      </AdminSection>

      <AdminSection title="Indicadores">
        <AdminStatsGrid>
          {dashboardQuery.isLoading ? (
            <>
              <AdminMetricCardSkeleton />
              <AdminMetricCardSkeleton />
              <AdminMetricCardSkeleton />
              <AdminMetricCardSkeleton />
            </>
          ) : (
            <>
              <AdminMetricCard
                title="Ticket médio"
                value={formatMoney(
                  data?.indicators.averageTicket ?? 0,
                  data?.indicators.currency,
                )}
              />
              <AdminMetricCard
                title="Churn"
                value={formatConversionRate(data?.indicators.churnRatePercent)}
              />
              <AdminMetricCard
                title="Conversão de plano"
                value={formatConversionRate(
                  data?.indicators.planConversionRatePercent,
                )}
              />
              <AdminMetricCard
                title="Inadimplência"
                value={formatConversionRate(
                  data?.indicators.delinquencyRatePercent,
                )}
              />
            </>
          )}
        </AdminStatsGrid>
      </AdminSection>

      <AdminSection title="Receita por plano">
        {dashboardQuery.isLoading ? (
          <AdminTableSkeleton columns={4} rows={4} />
        ) : (
          <AdminTable
            data={data?.plans ?? []}
            getRowId={(row) => row.planId}
            emptyTitle="Nenhum plano com receita"
            emptyDescription="Os planos com assinaturas ativas aparecerão aqui."
            columns={planColumns}
          />
        )}
      </AdminSection>

      <AdminSection title="Receita por ciclo de cobrança">
        {dashboardQuery.isLoading ? (
          <AdminTableSkeleton columns={4} rows={3} />
        ) : (
          <AdminTable
            data={data?.billingCycles ?? []}
            getRowId={(row) => row.billingCycle}
            emptyTitle="Nenhum ciclo com receita"
            emptyDescription="Os ciclos de cobrança com assinaturas aparecerão aqui."
            columns={billingCycleColumns}
          />
        )}
      </AdminSection>
    </AdminPage>
  );
}

export { AdminFinancialDashboardView };
