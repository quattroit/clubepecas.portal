"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Receipt } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { PageLoader } from "@/components/feedback/PageLoader";
import { Pagination } from "@/components/navigation/Pagination";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { sellerQuotationPath } from "@/constants/routes";
import { QuotationStatusBadge } from "@/features/professional-buyer/components/QuotationStatusBadge";
import { useSellerQuotations } from "@/hooks/api/useSellerQuotations";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";

const PAGE_SIZE = 20;

/**
 * Central de Cotações recebidas pela loja — somente leitura.
 */
function SellerQuotationsListView() {
  const [page, setPage] = useState(1);

  const params = useMemo(() => ({ page, pageSize: PAGE_SIZE }), [page]);
  const listQuery = useSellerQuotations(params);

  const items = listQuery.data?.items ?? [];
  const totalCount = listQuery.data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1">Central de Cotações</h1>
        <p className="text-small text-muted-foreground">
          Solicitações de cotação enviadas por compradores profissionais.
        </p>
      </div>

      {listQuery.isLoading ? <PageLoader label="Carregando cotações…" /> : null}

      {listQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar as cotações"
          message={getFriendlyErrorMessage(listQuery.error)}
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && items.length === 0 ? (
        <EmptyState
          title="Nenhuma cotação recebida ainda"
          description="Quando um comprador profissional solicitar uma cotação, ela aparecerá aqui."
          icon={<Receipt aria-hidden />}
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && items.length > 0 ? (
        <div className="border-border overflow-hidden rounded-2xl border shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted/40 border-border border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Número</th>
                  <th className="px-4 py-3 text-left font-medium">Comprador</th>
                  <th className="px-4 py-3 text-left font-medium">Empresa</th>
                  <th className="px-4 py-3 text-left font-medium">Itens</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Recebida em</th>
                  <th className="px-4 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-border hover:bg-muted/20 border-b last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium">{item.number}</td>
                    <td className="px-4 py-3">{item.buyerName}</td>
                    <td className="text-muted-foreground px-4 py-3">
                      {item.buyerCompanyName ?? "—"}
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {item.itemCount === 1 ? "1 item" : `${item.itemCount} itens`}
                    </td>
                    <td className="px-4 py-3">
                      <QuotationStatusBadge status={item.status} />
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {formatDate(item.submittedAtUtc)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <Link
                          href={sellerQuotationPath(item.id)}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon-sm" }),
                          )}
                          aria-label={`Ver cotação ${item.number}`}
                        >
                          <Eye className="size-4" aria-hidden />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {!listQuery.isLoading && totalPages > 1 ? (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}

export { SellerQuotationsListView };
