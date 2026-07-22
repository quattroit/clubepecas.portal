"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HandCoins } from "lucide-react";

import { AdminEmptyState, AdminPage, AdminSection, AdminTable } from "@/components/admin";
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
import { ROUTES } from "@/constants/routes";
import { isPayoutStatus } from "@/contracts/admin/payouts";
import type { RepresentativePayoutListItemDto } from "@/contracts/representative/portal";
import {
  useRepresentativePayout,
  useRepresentativePayouts,
} from "@/hooks/api/useRepresentativePayouts";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

function statusBadgeVariant(
  status: RepresentativePayoutListItemDto["status"],
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

function RepresentativePayoutsView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const [viewId, setViewId] = useState<number | null>(null);

  const listQuery = useRepresentativePayouts({ page, pageSize: 20 });
  const detailQuery = useRepresentativePayout(viewId ?? 0, viewId != null);

  const items = listQuery.data?.items ?? [];
  const totalPages = Math.max(1, listQuery.data?.totalPages ?? 1);

  const columns: AdminTableColumn<RepresentativePayoutListItemDto>[] = [
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
        <Badge variant={statusBadgeVariant(row.status)}>{row.statusLabel}</Badge>
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
        <Button type="button" variant="ghost" size="sm" onClick={() => setViewId(row.id)}>
          Detalhes
        </Button>
      ),
    },
  ];

  return (
    <AdminPage
      title="Pagamentos"
      description="Liquidações financeiras das suas comissões aprovadas."
    >
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
            caption="Pagamentos de comissões recebidos"
            emptyTitle="Nenhum pagamento registrado"
            emptyDescription="Seus pagamentos de comissões aparecerão aqui quando forem criados pela administração."
            pagination={
              totalPages > 1 ? (
                <Pagination
                  currentPage={listQuery.data?.currentPage ?? page}
                  totalPages={totalPages}
                  onPageChange={(nextPage) => {
                    const sp = new URLSearchParams(searchParams.toString());
                    sp.set("page", String(nextPage));
                    router.push(`${ROUTES.REPRESENTATIVE_PAYOUTS}?${sp.toString()}`);
                  }}
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
                <Detail label="Status" value={detailQuery.data.statusLabel} />
                <Detail
                  label="Período"
                  value={`${formatDate(detailQuery.data.referenceStart)} – ${formatDate(detailQuery.data.referenceEnd)}`}
                />
                <Detail label="Método" value={detailQuery.data.paymentMethodLabel} />
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
                  value={detailQuery.data.paidAt ? formatDate(detailQuery.data.paidAt) : "—"}
                />
                <Detail
                  label="Referência da transação"
                  value={detailQuery.data.transactionReference ?? "—"}
                />
                <Detail label="Criado em" value={formatDate(detailQuery.data.createdAt)} />
                <Detail label="Observações" value={detailQuery.data.notes ?? "—"} />
              </dl>

              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Comissões incluídas ({detailQuery.data.commissions.length})
                </p>
                <div className="border-border max-h-64 overflow-y-auto rounded-lg border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/40 border-border border-b">
                      <tr>
                        <th className="px-3 py-2 text-xs font-semibold uppercase">Vendedor</th>
                        <th className="px-3 py-2 text-xs font-semibold uppercase">Tipo</th>
                        <th className="px-3 py-2 text-xs font-semibold uppercase">Mês</th>
                        <th className="px-3 py-2 text-xs font-semibold uppercase">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      {detailQuery.data.commissions.map((commission) => (
                        <tr key={commission.id}>
                          <td className="px-3 py-2">{commission.sellerStoreName}</td>
                          <td className="px-3 py-2">{commission.commissionTypeLabel}</td>
                          <td className="px-3 py-2">{commission.referenceMonth}</td>
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
    </AdminPage>
  );
}

export { RepresentativePayoutsView };
