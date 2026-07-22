"use client";

import {
  BarChart3,
  CalendarCheck,
  DollarSign,
  HandCoins,
  Percent,
  Store,
  Users,
  Wallet,
} from "lucide-react";

import {
  AdminEmptyState,
  AdminMetricCard,
  AdminMetricCardSkeleton,
  AdminPage,
  AdminSection,
  AdminStatsGrid,
  AdminStatusBadge,
  AdminTable,
} from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Badge } from "@/components/ui/badge";
import type {
  RepresentativeDashboardCommissionItemDto,
  RepresentativeDashboardMonthlySummaryItemDto,
  RepresentativeDashboardSellerItemDto,
} from "@/contracts/representative/portal";
import { useRepresentativeDashboard } from "@/hooks/api/useRepresentativeDashboard";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { formatConversionRate, formatMetricCount } from "@/utils/formatMetrics";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

const commissionColumns: AdminTableColumn<RepresentativeDashboardCommissionItemDto>[] =
  [
    {
      id: "type",
      header: "Tipo",
      accessor: (row) => row.typeLabel,
    },
    {
      id: "amount",
      header: "Valor",
      accessor: (row) => formatCurrency(row.amount),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <Badge variant="secondary">{row.statusLabel}</Badge>,
    },
    {
      id: "month",
      header: "Mês",
      accessor: (row) => row.referenceMonth,
    },
    {
      id: "generatedAt",
      header: "Gerada em",
      accessor: (row) => formatDate(row.generatedAt),
    },
  ];

const sellerColumns: AdminTableColumn<RepresentativeDashboardSellerItemDto>[] = [
  {
    id: "storeName",
    header: "Loja",
    accessor: (row) => row.storeName,
  },
  {
    id: "city",
    header: "Cidade",
    accessor: (row) => row.city,
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <AdminStatusBadge status={row.isActive ? "active" : "inactive"} />
    ),
  },
  {
    id: "createdAt",
    header: "Cadastro",
    accessor: (row) => formatDate(row.createdAt),
  },
];

const monthlySummaryColumns: AdminTableColumn<RepresentativeDashboardMonthlySummaryItemDto>[] =
  [
    {
      id: "month",
      header: "Mês",
      accessor: (row) => row.referenceMonth,
    },
    {
      id: "generated",
      header: "Gerado",
      accessor: (row) => formatCurrency(row.generated),
    },
    {
      id: "approved",
      header: "Aprovado",
      accessor: (row) => formatCurrency(row.approved),
    },
    {
      id: "paid",
      header: "Pago",
      accessor: (row) => formatCurrency(row.paid),
    },
  ];

function RepresentativeDashboardView() {
  const dashboardQuery = useRepresentativeDashboard();
  const data = dashboardQuery.data;

  return (
    <AdminPage
      title="Dashboard"
      description="Resumo das suas comissões, vendedores e desempenho de indicação."
    >
      {dashboardQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar o dashboard"
          message={getFriendlyErrorMessage(dashboardQuery.error)}
        />
      ) : null}

      <AdminSection title="Comissões">
        <AdminStatsGrid aria-label="Resumo de comissões">
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
                title="Total gerado"
                value={formatCurrency(data?.totalGeneratedCommission ?? 0)}
                icon={<Wallet aria-hidden />}
              />
              <AdminMetricCard
                title="Pendente"
                value={formatCurrency(data?.totalPendingCommission ?? 0)}
              />
              <AdminMetricCard
                title="Aprovada"
                value={formatCurrency(data?.totalApprovedCommission ?? 0)}
              />
              <AdminMetricCard
                title="Paga"
                value={formatCurrency(data?.totalPaidCommission ?? 0)}
              />
            </>
          )}
        </AdminStatsGrid>
      </AdminSection>

      <AdminSection
        title="Pagamentos"
        description="Liquidações financeiras das suas comissões aprovadas."
      >
        <AdminStatsGrid aria-label="Resumo de pagamentos">
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
                title="Próximo pagamento"
                value={formatCurrency(data?.nextPayoutAmount ?? 0)}
                description="Comissões aprovadas aguardando pagamento"
                icon={<HandCoins aria-hidden />}
              />
              <AdminMetricCard
                title="Total recebido"
                value={formatCurrency(data?.totalReceivedFromPayouts ?? 0)}
                icon={<Wallet aria-hidden />}
              />
              <AdminMetricCard
                title="Pagamentos realizados"
                value={formatMetricCount(data?.paidPayoutsCount ?? 0)}
                icon={<CalendarCheck aria-hidden />}
              />
              <AdminMetricCard
                title="Último pagamento"
                value={
                  data?.lastPayoutAmount != null
                    ? formatCurrency(data.lastPayoutAmount)
                    : "—"
                }
                description={
                  data?.lastPayoutAt
                    ? `Recebido em ${formatDate(data.lastPayoutAt)}`
                    : "Nenhum pagamento recebido ainda"
                }
              />
            </>
          )}
        </AdminStatsGrid>
      </AdminSection>

      <AdminSection title="Indicadores">
        <AdminStatsGrid aria-label="Indicadores">
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
                title="Vendedores"
                value={formatMetricCount(data?.totalSellers ?? 0)}
                icon={<Store aria-hidden />}
              />
              <AdminMetricCard
                title="Assinaturas ativas"
                value={formatMetricCount(data?.activeSubscriptions ?? 0)}
                icon={<Users aria-hidden />}
              />
              <AdminMetricCard
                title="Receita gerada"
                value={formatCurrency(data?.revenueGenerated ?? 0)}
                description="Base das comissões"
                icon={<DollarSign aria-hidden />}
              />
              <AdminMetricCard
                title="Taxa de conversão"
                value={formatConversionRate(data?.conversionRate)}
                description="Vendedores com assinatura ativa"
                icon={<Percent aria-hidden />}
              />
            </>
          )}
        </AdminStatsGrid>
      </AdminSection>

      <AdminSection title="Últimas comissões">
        <AdminTable
          columns={commissionColumns}
          data={data?.latestCommissions ?? []}
          getRowId={(row) => row.id}
          loading={dashboardQuery.isLoading}
          caption="Últimas comissões geradas"
          emptyTitle="Nenhuma comissão gerada ainda"
          emptyDescription="Suas comissões mais recentes aparecerão aqui."
        />
      </AdminSection>

      <AdminSection title="Últimos vendedores">
        <AdminTable
          columns={sellerColumns}
          data={data?.latestSellers ?? []}
          getRowId={(row) => row.id}
          loading={dashboardQuery.isLoading}
          caption="Últimos vendedores vinculados"
          emptyTitle="Nenhum vendedor vinculado ainda"
          emptyDescription="Compartilhe seu link de indicação para vincular novos vendedores."
        />
      </AdminSection>

      <AdminSection
        title="Resumo mensal"
        description="Comissões geradas, aprovadas e pagas nos últimos meses."
      >
        {!dashboardQuery.isLoading && (data?.monthlySummary?.length ?? 0) === 0 ? (
          <AdminEmptyState
            title="Nenhum resumo mensal disponível"
            description="O resumo mensal aparecerá conforme comissões forem geradas."
            icon={<BarChart3 aria-hidden />}
          />
        ) : (
          <AdminTable
            columns={monthlySummaryColumns}
            data={data?.monthlySummary ?? []}
            getRowId={(row) => row.referenceMonth}
            loading={dashboardQuery.isLoading}
            caption="Resumo mensal de comissões"
            emptyTitle="Nenhum resumo mensal disponível"
          />
        )}
      </AdminSection>
    </AdminPage>
  );
}

export { RepresentativeDashboardView };
