"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { PageLoader } from "@/components/feedback/PageLoader";
import { Pagination } from "@/components/navigation/Pagination";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";
import { QuotationStatusBadge } from "@/features/professional-buyer/components/QuotationStatusBadge";
import { useMyQuotations } from "@/hooks/api/useMyQuotations";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";

const PAGE_SIZE = 20;

/**
 * Histórico de cotações enviadas pelo comprador profissional (somente leitura).
 */
function QuotationsHistoryListView() {
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({ page, pageSize: PAGE_SIZE }),
    [page],
  );

  const listQuery = useMyQuotations(params);
  const items = listQuery.data?.items ?? [];
  const totalCount = listQuery.data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1">Cotações enviadas</h1>
        <p className="text-small text-muted-foreground">
          Acompanhe as solicitações de cotação enviadas aos vendedores.
        </p>
      </div>

      {listQuery.isLoading ? <PageLoader label="Carregando cotações…" /> : null}

      {listQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar suas cotações"
          message={getFriendlyErrorMessage(listQuery.error)}
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && items.length === 0 ? (
        <EmptyState
          title="Nenhuma cotação enviada ainda"
          description="Adicione peças à sua cotação e envie a solicitação para um vendedor."
          icon={<FileText aria-hidden />}
          action={
            <Link
              href={ROUTES.PROFESSIONAL_BUYER_QUOTATION}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Ir para Minha Cotação
            </Link>
          }
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && items.length > 0 ? (
        <div className="border-border overflow-hidden rounded-2xl border shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-muted/40 border-border border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Número</th>
                  <th className="px-4 py-3 text-left font-medium">Vendedor</th>
                  <th className="px-4 py-3 text-left font-medium">Itens</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Enviada em</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-border hover:bg-muted/20 border-b last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium">{item.number}</td>
                    <td className="px-4 py-3">{item.storeName}</td>
                    <td className="text-muted-foreground px-4 py-3">
                      {item.itemCount === 1 ? "1 item" : `${item.itemCount} itens`}
                    </td>
                    <td className="px-4 py-3">
                      <QuotationStatusBadge status={item.status} />
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {formatDate(item.submittedAtUtc)}
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

export { QuotationsHistoryListView };
