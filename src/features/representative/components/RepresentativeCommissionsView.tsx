"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, Wallet } from "lucide-react";

import {
  AdminEmptyState,
  AdminFilterBar,
  AdminPage,
  AdminSection,
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
import { ROUTES } from "@/constants/routes";
import { isCommissionStatus } from "@/contracts/admin/commissions";
import type {
  RepresentativeCommissionListItemDto,
  RepresentativeCommissionStatusFilter,
  RepresentativeCommissionTypeFilter,
} from "@/contracts/representative/portal";
import {
  useRepresentativeCommission,
  useRepresentativeCommissions,
} from "@/hooks/api/useRepresentativeCommissions";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

function statusBadgeVariant(
  status: RepresentativeCommissionListItemDto["commissionStatus"],
): "default" | "success" | "destructive" | "secondary" {
  if (isCommissionStatus(status, "Approved")) return "success";
  if (isCommissionStatus(status, "Paid")) return "default";
  if (isCommissionStatus(status, "Cancelled")) return "destructive";
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

function RepresentativeCommissionsView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const status =
    (searchParams.get("status") as RepresentativeCommissionStatusFilter | null) ??
    "all";
  const type =
    (searchParams.get("type") as RepresentativeCommissionTypeFilter | null) ??
    "all";
  const fromUtc = searchParams.get("fromUtc") ?? "";
  const toUtc = searchParams.get("toUtc") ?? "";

  const [viewId, setViewId] = useState<number | null>(null);

  const params = useMemo(
    () => ({
      page,
      pageSize: 20,
      status,
      type,
      fromUtc: fromUtc || undefined,
      toUtc: toUtc || undefined,
    }),
    [page, status, type, fromUtc, toUtc],
  );

  const listQuery = useRepresentativeCommissions(params);
  const detailQuery = useRepresentativeCommission(viewId ?? 0, viewId != null);

  const patch = (next: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all") sp.delete(key);
      else sp.set(key, value);
    });
    if (!("page" in next)) sp.set("page", "1");
    const qs = sp.toString();
    router.push(
      qs
        ? `${ROUTES.REPRESENTATIVE_COMMISSIONS}?${qs}`
        : ROUTES.REPRESENTATIVE_COMMISSIONS,
    );
  };

  const items = listQuery.data?.items ?? [];
  const totalPages = Math.max(1, listQuery.data?.totalPages ?? 1);

  const columns: AdminTableColumn<RepresentativeCommissionListItemDto>[] = [
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
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setViewId(row.id)}
        >
          <Eye className="size-3.5" />
          Detalhes
        </Button>
      ),
    },
  ];

  return (
    <AdminPage
      title="Comissões"
      description="Comissões geradas a partir das vendas dos seus vendedores vinculados."
    >
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
                De
              </label>
              <Input
                type="date"
                className="h-10"
                defaultValue={fromUtc}
                onBlur={(event) =>
                  patch({ fromUtc: event.target.value || undefined })
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                Até
              </label>
              <Input
                type="date"
                className="h-10"
                defaultValue={toUtc}
                onBlur={(event) =>
                  patch({ toUtc: event.target.value || undefined })
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
            caption="Comissões do representante"
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
              <Detail label="Vendedor" value={detailQuery.data.sellerStoreName} />
              <Detail label="Pagamento" value={`#${detailQuery.data.paymentId}`} />
              <Detail label="Plano" value={detailQuery.data.planName ?? "—"} />
              <Detail label="Tipo" value={detailQuery.data.commissionTypeLabel} />
              <Detail label="Status" value={detailQuery.data.commissionStatusLabel} />
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
              <Detail label="Mês" value={detailQuery.data.referenceMonth} />
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
                label="Paga em"
                value={
                  detailQuery.data.paidAt
                    ? formatDate(detailQuery.data.paidAt)
                    : "—"
                }
              />
              <Detail label="Observações" value={detailQuery.data.notes ?? "—"} />
            </dl>
          ) : null}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Fechar
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}

export { RepresentativeCommissionsView };
