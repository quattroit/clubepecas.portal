"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, Wallet } from "lucide-react";

import {
  AdminEmptyState,
  AdminFilterBar,
  AdminMetricCard,
  AdminPage,
  AdminSection,
  AdminStatsGrid,
  AdminTable,
  ConfirmDialog,
} from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin";
import { Pagination } from "@/components/navigation/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/routes";
import type {
  AdminCommissionListItemDto,
  AdminCommissionStatusFilter,
  AdminCommissionTypeFilter,
} from "@/contracts/admin/commissions";
import { isCommissionStatus } from "@/contracts/admin/commissions";
import {
  useApproveAdminCommission,
  useCancelAdminCommission,
} from "@/hooks/api/useAdminCommissionActions";
import {
  useAdminCommission,
  useAdminCommissions,
} from "@/hooks/api/useAdminCommissions";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

function statusBadgeVariant(
  status: AdminCommissionListItemDto["commissionStatus"],
): "default" | "success" | "destructive" | "secondary" {
  if (isCommissionStatus(status, "Approved")) return "success";
  if (isCommissionStatus(status, "Paid")) return "default";
  if (isCommissionStatus(status, "Cancelled")) return "destructive";
  return "secondary";
}

function AdminCommissionsView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const status =
    (searchParams.get("status") as AdminCommissionStatusFilter | null) ?? "all";
  const type =
    (searchParams.get("type") as AdminCommissionTypeFilter | null) ?? "all";
  const representativeIdRaw = searchParams.get("representativeId");
  const sellerIdRaw = searchParams.get("sellerId");
  const referenceMonth = searchParams.get("referenceMonth") ?? undefined;

  const params = useMemo(
    () => ({
      page,
      pageSize: 20,
      status,
      type,
      representativeId: representativeIdRaw
        ? Number(representativeIdRaw)
        : undefined,
      sellerId: sellerIdRaw ? Number(sellerIdRaw) : undefined,
      referenceMonth,
    }),
    [page, status, type, representativeIdRaw, sellerIdRaw, referenceMonth],
  );

  const listQuery = useAdminCommissions(params);
  const approveMutation = useApproveAdminCommission();
  const cancelMutation = useCancelAdminCommission();

  const [viewId, setViewId] = useState<number | null>(null);
  const [approveId, setApproveId] = useState<number | null>(null);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const detailQuery = useAdminCommission(viewId ?? 0, viewId != null);

  const patch = (next: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all") sp.delete(key);
      else sp.set(key, value);
    });
    if (!("page" in next)) sp.set("page", "1");
    const qs = sp.toString();
    router.push(qs ? `${ROUTES.ADMIN_COMMISSIONS}?${qs}` : ROUTES.ADMIN_COMMISSIONS);
  };

  const summary = listQuery.data?.summary;
  const items = listQuery.data?.items ?? [];
  const totalPages = Math.max(1, listQuery.data?.totalPages ?? 1);

  const columns: AdminTableColumn<AdminCommissionListItemDto>[] = [
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
      id: "seller",
      header: "Vendedor",
      accessor: (row) => row.sellerStoreName,
    },
    {
      id: "type",
      header: "Tipo",
      accessor: (row) => row.commissionTypeLabel,
    },
    {
      id: "base",
      header: "Valor Base",
      accessor: (row) => formatCurrency(row.baseAmount),
    },
    {
      id: "pct",
      header: "Percentual",
      accessor: (row) => `${row.commissionPercentage}%`,
    },
    {
      id: "amount",
      header: "Comissão",
      accessor: (row) => formatCurrency(row.commissionAmount),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant={statusBadgeVariant(row.commissionStatus)}>
          {row.commissionStatusLabel}
        </Badge>
      ),
    },
    {
      id: "month",
      header: "Mês Referência",
      accessor: (row) => row.referenceMonth,
    },
    {
      id: "generated",
      header: "Gerada em",
      accessor: (row) => formatDate(row.generatedAt),
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
          {isCommissionStatus(row.commissionStatus, "Pending") ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setApproveId(row.id)}
            >
              Aprovar
            </Button>
          ) : null}
          {!isCommissionStatus(row.commissionStatus, "Paid") &&
          !isCommissionStatus(row.commissionStatus, "Cancelled") ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setCancelReason("");
                setCancelId(row.id);
              }}
            >
              Cancelar
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <AdminPage
      title="Comissões"
      description="Comissões geradas automaticamente a partir de pagamentos elegíveis."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Comissões" },
      ]}
    >
      <AdminSection title="Resumo">
        <AdminStatsGrid aria-label="Resumo de comissões">
          <AdminMetricCard
            title="Total de comissões"
            value={formatCurrency(summary?.totalCommissionAmount ?? 0)}
            icon={<Wallet className="size-4" />}
          />
          <AdminMetricCard
            title="Valor pendente"
            value={formatCurrency(summary?.pendingAmount ?? 0)}
          />
          <AdminMetricCard
            title="Valor aprovado"
            value={formatCurrency(summary?.approvedAmount ?? 0)}
          />
          <AdminMetricCard
            title="Valor pago"
            value={formatCurrency(summary?.paidAmount ?? 0)}
          />
          <AdminMetricCard
            title="Representantes com comissão"
            value={String(summary?.representativesWithCommission ?? 0)}
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
                <option value="Approved">Aprovada</option>
                <option value="Paid">Paga</option>
                <option value="Cancelled">Cancelada</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                Tipo
              </label>
              <select
                className={selectClassName}
                value={type}
                onChange={(event) => patch({ type: event.target.value })}
              >
                <option value="all">Todos</option>
                <option value="FirstSale">Primeira venda</option>
                <option value="Recurring">Recorrência</option>
                <option value="Adjustment">Ajuste</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                Mês (yyyy-MM)
              </label>
              <Input
                className="h-10 w-36"
                placeholder="2026-07"
                defaultValue={referenceMonth ?? ""}
                onBlur={(event) =>
                  patch({ referenceMonth: event.target.value.trim() || undefined })
                }
              />
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
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                ID Vendedor
              </label>
              <Input
                className="h-10 w-28"
                inputMode="numeric"
                defaultValue={sellerIdRaw ?? ""}
                onBlur={(event) =>
                  patch({ sellerId: event.target.value.trim() || undefined })
                }
              />
            </div>
          </div>
        }
      />

      <AdminSection title="Listagem">
        {listQuery.isError ? (
          <AdminEmptyState
            title="Não foi possível carregar as comissões"
            description={getFriendlyErrorMessage(listQuery.error)}
            icon={<Wallet aria-hidden />}
          />
        ) : (
          <AdminTable
            columns={columns}
            data={items}
            getRowId={(row) => row.id}
            loading={listQuery.isLoading}
            caption="Comissões de representantes"
            emptyTitle="Nenhuma comissão encontrada"
            emptyDescription="Comissões são geradas automaticamente quando pagamentos elegíveis são confirmados."
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da comissão</DialogTitle>
            <DialogDescription>
              Registro permanente gerado a partir do pagamento.
            </DialogDescription>
          </DialogHeader>
          {detailQuery.isLoading ? (
            <p className="text-muted-foreground text-sm">Carregando…</p>
          ) : detailQuery.data ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              <Detail
                label="Representante"
                value={`${detailQuery.data.representativeName} (${detailQuery.data.representativeCode})`}
              />
              <Detail
                label="Vendedor"
                value={detailQuery.data.sellerStoreName}
              />
              <Detail
                label="Pagamento"
                value={`#${detailQuery.data.paymentId}`}
              />
              <Detail
                label="Plano"
                value={detailQuery.data.planName ?? "—"}
              />
              <Detail
                label="Tipo"
                value={detailQuery.data.commissionTypeLabel}
              />
              <Detail
                label="Status"
                value={detailQuery.data.commissionStatusLabel}
              />
              <Detail
                label="Valor base"
                value={formatCurrency(detailQuery.data.baseAmount)}
              />
              <Detail
                label="Percentual"
                value={`${detailQuery.data.commissionPercentage}%`}
              />
              <Detail
                label="Comissão"
                value={formatCurrency(detailQuery.data.commissionAmount)}
              />
              <Detail
                label="Mês"
                value={detailQuery.data.referenceMonth}
              />
              <Detail
                label="Gerada em"
                value={formatDate(detailQuery.data.generatedAt)}
              />
              <Detail
                label="Aprovada em"
                value={
                  detailQuery.data.approvedAt
                    ? formatDate(detailQuery.data.approvedAt)
                    : "—"
                }
              />
              <Detail
                label="Observações"
                value={detailQuery.data.notes ?? "—"}
              />
            </dl>
          ) : null}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Fechar
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={approveId != null}
        onOpenChange={(open) => {
          if (!open) setApproveId(null);
        }}
        title="Aprovar comissão?"
        description="A comissão ficará disponível para pagamento futuro."
        confirmLabel="Aprovar"
        confirmVariant="primary"
        loading={approveMutation.isPending}
        onConfirm={() => {
          if (approveId == null) return;
          approveMutation.mutate(approveId, {
            onSuccess: () => setApproveId(null),
          });
        }}
      />

      <Dialog
        open={cancelId != null}
        onOpenChange={(open) => {
          if (!open) setCancelId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar comissão</DialogTitle>
            <DialogDescription>
              Informe o motivo. Uma comissão cancelada não volta para Pendente.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cancel-reason">Motivo</Label>
            <Textarea
              id="cancel-reason"
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
              disabled={!cancelReason.trim() || cancelMutation.isPending}
              onClick={() => {
                if (cancelId == null) return;
                cancelMutation.mutate(
                  { id: cancelId, reason: cancelReason.trim() },
                  { onSuccess: () => setCancelId(null) },
                );
              }}
            >
              Cancelar comissão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
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

export { AdminCommissionsView };
