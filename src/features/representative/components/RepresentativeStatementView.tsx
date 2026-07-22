"use client";

import { ScrollText } from "lucide-react";

import {
  AdminEmptyState,
  AdminMetricCard,
  AdminPage,
  AdminSection,
  AdminStatsGrid,
  AdminTable,
} from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin";
import type { RepresentativeStatementMonthDto } from "@/contracts/representative/portal";
import { useRepresentativeStatement } from "@/hooks/api/useRepresentativeStatement";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { formatCurrency } from "@/utils/formatCurrency";

function RepresentativeStatementView() {
  const statementQuery = useRepresentativeStatement();
  const items = statementQuery.data?.items ?? [];

  const totals = items.reduce(
    (acc, item) => ({
      generated: acc.generated + item.totalGenerated,
      approved: acc.approved + item.totalApproved,
      paid: acc.paid + item.totalPaid,
      pending: acc.pending + item.totalPending,
    }),
    { generated: 0, approved: 0, paid: 0, pending: 0 },
  );

  const columns: AdminTableColumn<RepresentativeStatementMonthDto>[] = [
    {
      id: "month",
      header: "Mês",
      accessor: (row) => row.referenceMonth,
    },
    {
      id: "count",
      header: "Comissões",
      accessor: (row) => String(row.count),
    },
    {
      id: "generated",
      header: "Total gerado",
      accessor: (row) => formatCurrency(row.totalGenerated),
    },
    {
      id: "pending",
      header: "Pendente",
      accessor: (row) => formatCurrency(row.totalPending),
    },
    {
      id: "approved",
      header: "Aprovado",
      accessor: (row) => formatCurrency(row.totalApproved),
    },
    {
      id: "paid",
      header: "Pago",
      accessor: (row) => formatCurrency(row.totalPaid),
    },
  ];

  return (
    <AdminPage
      title="Extrato"
      description="Resumo mensal das suas comissões geradas, pendentes, aprovadas e pagas."
    >
      {statementQuery.isError ? (
        <AdminEmptyState
          title="Não foi possível carregar o extrato"
          description={getFriendlyErrorMessage(statementQuery.error)}
          icon={<ScrollText aria-hidden />}
        />
      ) : (
        <>
          <AdminSection title="Totais">
            <AdminStatsGrid aria-label="Totais do extrato">
              <AdminMetricCard
                title="Total gerado"
                value={formatCurrency(totals.generated)}
                loading={statementQuery.isLoading}
              />
              <AdminMetricCard
                title="Pendente"
                value={formatCurrency(totals.pending)}
                loading={statementQuery.isLoading}
              />
              <AdminMetricCard
                title="Aprovado"
                value={formatCurrency(totals.approved)}
                loading={statementQuery.isLoading}
              />
              <AdminMetricCard
                title="Pago"
                value={formatCurrency(totals.paid)}
                loading={statementQuery.isLoading}
              />
            </AdminStatsGrid>
          </AdminSection>

          <AdminSection title="Detalhamento mensal">
            <AdminTable
              columns={columns}
              data={items}
              getRowId={(row) => row.referenceMonth}
              loading={statementQuery.isLoading}
              caption="Extrato mensal de comissões"
              emptyTitle="Nenhum registro de comissão"
              emptyDescription="O extrato mensal aparecerá aqui quando houver comissões geradas."
            />
          </AdminSection>
        </>
      )}
    </AdminPage>
  );
}

export { RepresentativeStatementView };
