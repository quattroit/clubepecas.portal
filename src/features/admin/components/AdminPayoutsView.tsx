"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Ban, CheckCircle2, Eye, HandCoins } from "lucide-react";

import {
  AdminEmptyState,
  AdminFilterBar,
  AdminMetricCard,
  AdminPage,
  AdminSection,
  AdminStatsGrid,
  AdminTable,
} from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin";
import { Pagination } from "@/components/navigation/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/routes";
import type {
  AdminPayoutListItemDto,
  AdminPayoutStatusFilter,
} from "@/contracts/admin/payouts";
import { isPayoutStatus } from "@/contracts/admin/payouts";
import {
  useCancelAdminPayout,
  usePayAdminPayout,
} from "@/hooks/api/useAdminPayoutActions";
import { useAdminPayout, useAdminPayouts } from "@/hooks/api/useAdminPayouts";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

function statusBadgeVariant(
  status: AdminPayoutListItemDto["status"],
): "default" | "success" | "destructive" | "secondary" {
  if (isPayoutStatus(status, "Paid")) return "success";
  if (isPayoutStatus(status, "Cancelled")) return "destructive";
  return "secondary";
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

function AdminPayoutsView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const status =
    (searchParams.get("status") as AdminPayoutStatusFilter | null) ?? "all";
  const representativeIdRaw = searchParams.get("representativeId");

  const params = useMemo(
    () => ({
      page,
      pageSize: 20,
      status,
      representativeId: representativeIdRaw
        ? Number(representativeIdRaw)
        : undefined,
    }),
    [page, status, representativeIdRaw],
  );

  const listQuery = useAdminPayouts(params);
  const payMutation = usePayAdminPayout();
  const cancelMutation = useCancelAdminPayout();

  const [viewId, setViewId] = useState<number | null>(null);
  const [payId, setPayId] = useState<number | null>(null);
  const [transactionReference, setTransactionReference] = useState("");
  const [payNotes, setPayNotes] = useState("");
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const detailQuery = useAdminPayout(viewId ?? 0, viewId != null);

  const patch = (next: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all") sp.delete(key);
      else sp.set(key, value);
    });
    if (!("page" in next)) sp.set("page", "1");
    const qs = sp.toString();
    router.push(qs ? `${ROUTES.ADMIN_PAYOUTS}?${qs}` : ROUTES.ADMIN_PAYOUTS);
  };

  const summary = listQuery.data?.summary;
  const items = listQuery.data?.items ?? [];
  const totalPages = Math.max(1, listQuery.data?.totalPages ?? 1);

  const columns: AdminTableColumn<AdminPayoutListItemDto>[] = [
    {
      id: "representative",
      header: "Representante",
      cell: (row) => (
        <div>
          <p className="font-medium">{row.representativeName}</p>
          <p className="font-mono text-xs">{row.representativeCode}</p>
        </div>
      ),
    },
    {
      id: "period",
      header: "Período",
      cell: (row) => (
        <span className="text-xs">
          {formatDate(row.referenceStart)} – {formatDate(row.referenceEnd)}
        </span>
      ),
    },
    {
      id: "items",
      header: "Comissões",
      accessor: (row) => String(row.itemCount),
    },
    {
      id: "gross",
      header: "Bruto",
      accessor: (row) => formatCurrency(row.grossAmount),
    },
    {
      id: "discount",
      header: "Desconto",
      accessor: (row) => formatCurrency(row.discountAmount),
    },
    {
      id: "net",
      header: "Líquido",
      accessor: (row) => formatCurrency(row.netAmount),
    },
    {
      id: "method",
      header: "Método",
      accessor: (row) => row.paymentMethodLabel,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant={statusBadgeVariant(row.status)}>
          {row.statusLabel}
        </Badge>
      ),
    },
    {
      id: "paidAt",
      header: "Pago em",
      accessor: (row) => (row.paidAt ? formatDate(row.paidAt) : "—"),
    },
    {
      id: "actions",
      header: "Ações",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setViewId(row.id)}
          >
            <Eye className="size-3.5" />
            Detalhes
          </Button>
          {isPayoutStatus(row.status, "Pending") ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTransactionReference("");
                  setPayNotes("");
                  setPayId(row.id);
                }}
              >
                <CheckCircle2 className="size-3.5" />
                Pagar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCancelReason("");
                  setCancelId(row.id);
                }}
              >
                <Ban className="size-3.5" />
                Cancelar
              </Button>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <AdminPage
      title="Pagamentos de comissões"
      description="Liquidações financeiras das comissões aprovadas de representantes."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Pagamentos de comissões" },
      ]}
    >
      <AdminSection title="Resumo">
        <AdminStatsGrid aria-label="Resumo de pagamentos">
          <AdminMetricCard
            title="Pagamentos pendentes"
            value={String(summary?.pendingCount ?? 0)}
            icon={<HandCoins className="size-4" />}
          />
          <AdminMetricCard
            title="Valor pendente"
            value={formatCurrency(summary?.pendingAmount ?? 0)}
          />
          <AdminMetricCard
            title="Pagamentos realizados"
            value={String(summary?.paidCount ?? 0)}
          />
          <AdminMetricCard
            title="Valor pago"
            value={formatCurrency(summary?.paidAmount ?? 0)}
          />
        </AdminStatsGrid>
      </AdminSection>

      <AdminFilterBar
        filters={
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                Status
              </label>
              <select
                className={selectClassName}
                value={status}
                onChange={(event) => patch({ status: event.target.value })}
              >
                <option value="all">Todos</option>
                <option value="Pending">Pendente</option>
                <option value="Paid">Pago</option>
                <option value="Cancelled">Cancelado</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                ID Representante
              </label>
              <Input
                className="h-10 w-28"
                inputMode="numeric"
                defaultValue={representativeIdRaw ?? ""}
                onBlur={(event) =>
                  patch({
                    representativeId: event.target.value.trim() || undefined,
                  })
                }
              />
            </div>
          </div>
        }
      />

      <AdminSection title="Listagem">
        {listQuery.isError ? (
          <AdminEmptyState
            title="Não foi possível carregar os pagamentos"
            description={getFriendlyErrorMessage(listQuery.error)}
            icon={<HandCoins aria-hidden />}
          />
        ) : (
          <AdminTable
            columns={columns}
            data={items}
            getRowId={(row) => row.id}
            loading={listQuery.isLoading}
            caption="Pagamentos de comissões de representantes"
            emptyTitle="Nenhum pagamento encontrado"
            emptyDescription="Pagamentos aparecem aqui após serem criados a partir de comissões aprovadas."
            pagination={
              totalPages > 1 ? (
                <Pagination
                  currentPage={listQuery.data?.currentPage ?? page}
                  totalPages={totalPages}
                  onPageChange={(nextPage) =>
                    patch({ page: String(nextPage) })
                  }
                />
              ) : null
            }
          />
        )}
      </AdminSection>

      <Dialog
        open={viewId != null}
        onOpenChange={(open) => {
          if (!open) setViewId(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do pagamento</DialogTitle>
            <DialogDescription>
              Liquidação financeira e comissões incluídas.
            </DialogDescription>
          </DialogHeader>
          {detailQuery.isLoading ? (
            <p className="text-muted-foreground text-sm">Carregando…</p>
          ) : detailQuery.data ? (
            <div className="flex flex-col gap-4">
              <dl className="grid gap-3 sm:grid-cols-2">
                <Detail
                  label="Representante"
                  value={`${detailQuery.data.representativeName} (${detailQuery.data.representativeCode})`}
                />
                <Detail
                  label="Status"
                  value={detailQuery.data.statusLabel}
                />
                <Detail
                  label="Período"
                  value={`${formatDate(detailQuery.data.referenceStart)} – ${formatDate(detailQuery.data.referenceEnd)}`}
                />
                <Detail
                  label="Método"
                  value={detailQuery.data.paymentMethodLabel}
                />
                <Detail
                  label="Valor bruto"
                  value={formatCurrency(detailQuery.data.grossAmount)}
                />
                <Detail
                  label="Desconto"
                  value={formatCurrency(detailQuery.data.discountAmount)}
                />
                <Detail
                  label="Valor líquido"
                  value={formatCurrency(detailQuery.data.netAmount)}
                />
                <Detail
                  label="Pago em"
                  value={
                    detailQuery.data.paidAt
                      ? formatDate(detailQuery.data.paidAt)
                      : "—"
                  }
                />
                <Detail
                  label="Referência da transação"
                  value={detailQuery.data.transactionReference ?? "—"}
                />
                <Detail
                  label="Criado em"
                  value={formatDate(detailQuery.data.createdAt)}
                />
                <Detail
                  label="Observações"
                  value={detailQuery.data.notes ?? "—"}
                />
                {detailQuery.data.cancelReason ? (
                  <Detail
                    label="Motivo do cancelamento"
                    value={detailQuery.data.cancelReason}
                  />
                ) : null}
              </dl>

              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Comissões incluídas ({detailQuery.data.commissions.length})
                </p>
                <div className="border-border max-h-64 overflow-y-auto rounded-lg border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/40 border-border border-b">
                      <tr>
                        <th className="px-3 py-2 text-xs font-semibold uppercase">
                          Vendedor
                        </th>
                        <th className="px-3 py-2 text-xs font-semibold uppercase">
                          Tipo
                        </th>
                        <th className="px-3 py-2 text-xs font-semibold uppercase">
                          Mês
                        </th>
                        <th className="px-3 py-2 text-xs font-semibold uppercase">
                          Valor
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      {detailQuery.data.commissions.map((commission) => (
                        <tr key={commission.id}>
                          <td className="px-3 py-2">
                            {commission.sellerStoreName}
                          </td>
                          <td className="px-3 py-2">
                            {commission.commissionTypeLabel}
                          </td>
                          <td className="px-3 py-2">
                            {commission.referenceMonth}
                          </td>
                          <td className="px-3 py-2">
                            {formatCurrency(commission.commissionAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Fechar
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={payId != null}
        onOpenChange={(open) => {
          if (!open) setPayId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar pagamento</DialogTitle>
            <DialogDescription>
              Registre o pagamento como concluído. Informe a referência da
              transação, se houver.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="transaction-reference">
                Referência da transação (opcional)
              </Label>
              <Input
                id="transaction-reference"
                value={transactionReference}
                onChange={(event) =>
                  setTransactionReference(event.target.value)
                }
                placeholder="Ex.: PIX-123456"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pay-notes">Observações (opcional)</Label>
              <Textarea
                id="pay-notes"
                value={payNotes}
                onChange={(event) => setPayNotes(event.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Voltar
            </DialogClose>
            <Button
              type="button"
              variant="primary"
              disabled={payMutation.isPending}
              onClick={() => {
                if (payId == null) return;
                payMutation.mutate(
                  {
                    id: payId,
                    transactionReference:
                      transactionReference.trim() || undefined,
                    notes: payNotes.trim() || undefined,
                  },
                  { onSuccess: () => setPayId(null) },
                );
              }}
            >
              Confirmar pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={cancelId != null}
        onOpenChange={(open) => {
          if (!open) setCancelId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar pagamento</DialogTitle>
            <DialogDescription>
              As comissões incluídas voltam a ficar disponíveis para um novo
              pagamento.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="payout-cancel-reason">Motivo (opcional)</Label>
            <Textarea
              id="payout-cancel-reason"
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Voltar
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={cancelMutation.isPending}
              onClick={() => {
                if (cancelId == null) return;
                cancelMutation.mutate(
                  { id: cancelId, reason: cancelReason.trim() || undefined },
                  { onSuccess: () => setCancelId(null) },
                );
              }}
            >
              Cancelar pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}

export { AdminPayoutsView };
