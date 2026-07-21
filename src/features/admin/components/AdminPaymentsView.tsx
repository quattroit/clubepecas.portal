"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";

import { AdminPage, AdminSection, AdminTable } from "@/components/admin";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { AdminPaymentListItemDto } from "@/contracts/admin/payments";
import {
  paymentMethodLabel,
  paymentStatusLabel,
} from "@/features/dashboard/components/subscription/payment-display";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

function useAdminPayments() {
  return useQuery({
    queryKey: queryKeys.admin.payments.list({}),
    queryFn: () => adminService.listPayments({ page: 1, pageSize: 50 }),
  });
}

function useSyncAdminPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: number) => adminService.syncPayment(paymentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.payments.all,
      });
    },
  });
}

function AdminPaymentsView() {
  const paymentsQuery = useAdminPayments();
  const syncMutation = useSyncAdminPayment();

  const rows: AdminPaymentListItemDto[] = paymentsQuery.data?.items ?? [];

  return (
    <AdminPage
      title="Pagamentos"
      description="Movimentações financeiras e sincronização com o Asaas."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Pagamentos" },
      ]}
    >
      {paymentsQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar os pagamentos"
          message={getFriendlyErrorMessage(paymentsQuery.error)}
        />
      ) : null}

      <AdminSection title="Listagem">
        <AdminTable
          data={rows}
          getRowId={(row) => row.id}
          loading={paymentsQuery.isLoading}
          emptyTitle="Nenhum pagamento registrado"
          emptyDescription="Pagamentos do domínio financeiro aparecerão aqui após checkouts e webhooks."
          columns={[
            {
              id: "id",
              header: "ID",
              cell: (row) => row.id,
            },
            {
              id: "seller",
              header: "Vendedor",
              cell: (row) => row.sellerName,
            },
            {
              id: "plan",
              header: "Plano",
              cell: (row) => row.planName ?? "—",
            },
            {
              id: "amount",
              header: "Valor",
              cell: (row) => formatCurrency(row.amount),
            },
            {
              id: "status",
              header: "Status",
              cell: (row) => paymentStatusLabel(row.status),
            },
            {
              id: "method",
              header: "Método",
              cell: (row) => paymentMethodLabel(row.method),
            },
            {
              id: "dueDate",
              header: "Vencimento",
              cell: (row) =>
                row.dueDateUtc ? formatDate(row.dueDateUtc) : "—",
            },
            {
              id: "paidAt",
              header: "Pago em",
              cell: (row) =>
                row.paidAtUtc ? formatDate(row.paidAtUtc) : "—",
            },
            {
              id: "nextBilling",
              header: "Próx. cobrança",
              cell: (row) =>
                row.nextBillingDateUtc
                  ? formatDate(row.nextBillingDateUtc)
                  : "—",
            },
            {
              id: "webhook",
              header: "Último webhook",
              cell: (row) =>
                row.lastWebhookEventType
                  ? `${row.lastWebhookEventType}${
                      row.lastWebhookAtUtc
                        ? ` · ${formatDate(row.lastWebhookAtUtc)}`
                        : ""
                    }`
                  : "—",
            },
            {
              id: "actions",
              header: "Ações",
              cell: (row) => {
                const isSyncing =
                  syncMutation.isPending &&
                  syncMutation.variables === row.id;

                return (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={syncMutation.isPending}
                    onClick={() => syncMutation.mutate(row.id)}
                  >
                    {isSyncing ? (
                      <Loader2 className="size-3.5 animate-spin" aria-hidden />
                    ) : (
                      <RefreshCw className="size-3.5" aria-hidden />
                    )}
                    Sincronizar
                  </Button>
                );
              },
            },
          ]}
        />
        {syncMutation.isError ? (
          <p className="text-destructive mt-3 text-sm" role="alert">
            {getFriendlyErrorMessage(syncMutation.error)}
          </p>
        ) : null}
        {syncMutation.isSuccess ? (
          <p className="text-muted-foreground mt-3 text-sm">
            {syncMutation.data.message ?? "Pagamento sincronizado."}
          </p>
        ) : null}
      </AdminSection>
    </AdminPage>
  );
}

export { AdminPaymentsView };
