"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, Receipt } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { PageLoader } from "@/components/feedback/PageLoader";
import { Pagination } from "@/components/navigation/Pagination";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ROUTES, sellerQuotationPath } from "@/constants/routes";
import { QuotationStatusBadge } from "@/features/professional-buyer/components/QuotationStatusBadge";
import {
  QUOTATION_STATUS_FILTER_OPTIONS,
  type QuotationStatusFilter,
} from "@/features/professional-buyer/utils/quotationStatus";
import {
  QUOTATION_DEFAULT_PAGE_SIZE,
  QUOTATION_PAGE_SIZE_OPTIONS,
  parseQuotationPageSize,
} from "@/features/professional-buyer/utils/quotationPagination";
import { useSellerQuotations } from "@/hooks/api/useSellerQuotations";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

/**
 * Central de Cotações recebidas pela loja — somente leitura.
 */
function SellerQuotationsListView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const pageSize = parseQuotationPageSize(searchParams.get("pageSize"));
  const number = searchParams.get("number") ?? "";
  const buyer = searchParams.get("buyer") ?? "";
  const status =
    (searchParams.get("status") as QuotationStatusFilter | null) ?? "all";
  const submittedFrom = searchParams.get("submittedFrom") ?? "";
  const submittedTo = searchParams.get("submittedTo") ?? "";

  const [numberDraft, setNumberDraft] = useState(number);
  const [buyerDraft, setBuyerDraft] = useState(buyer);

  const params = useMemo(
    () => ({
      page,
      pageSize,
      number: number || undefined,
      buyer: buyer || undefined,
      status: status === "all" ? undefined : status,
      submittedFrom: submittedFrom || undefined,
      submittedTo: submittedTo || undefined,
    }),
    [page, pageSize, number, buyer, status, submittedFrom, submittedTo],
  );

  const listQuery = useSellerQuotations(params);

  const patch = (next: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all") sp.delete(key);
      else sp.set(key, value);
    });
    if (!("page" in next)) sp.set("page", "1");
    const qs = sp.toString();
    router.push(
      qs ? `${ROUTES.SELLER_QUOTATIONS}?${qs}` : ROUTES.SELLER_QUOTATIONS,
    );
  };

  const applyTextFilters = () => {
    patch({
      number: numberDraft.trim() || undefined,
      buyer: buyerDraft.trim() || undefined,
    });
  };

  const clearFilters = () => {
    setNumberDraft("");
    setBuyerDraft("");
    patch({
      number: undefined,
      buyer: undefined,
      status: undefined,
      submittedFrom: undefined,
      submittedTo: undefined,
      page: "1",
    });
  };

  const items = listQuery.data?.items ?? [];
  const totalCount = listQuery.data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const hasFilters = Boolean(
    number || buyer || status !== "all" || submittedFrom || submittedTo,
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1">Central de Cotações</h1>
        <p className="text-small text-muted-foreground">
          Solicitações de cotação enviadas por compradores profissionais.
        </p>
      </div>

      <div className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-4 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="sq-number" className="text-sm font-medium">
              Número
            </label>
            <Input
              id="sq-number"
              value={numberDraft}
              onChange={(event) => setNumberDraft(event.target.value)}
              placeholder="Ex.: COT-2026…"
              onKeyDown={(event) => {
                if (event.key === "Enter") applyTextFilters();
              }}
            />
          </div>

          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="sq-buyer" className="text-sm font-medium">
              Comprador
            </label>
            <Input
              id="sq-buyer"
              value={buyerDraft}
              onChange={(event) => setBuyerDraft(event.target.value)}
              placeholder="Nome ou empresa…"
              onKeyDown={(event) => {
                if (event.key === "Enter") applyTextFilters();
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:w-44">
            <label htmlFor="sq-status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="sq-status"
              className={selectClassName}
              value={status}
              onChange={(event) =>
                patch({ status: event.target.value || undefined })
              }
            >
              {QUOTATION_STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sq-from" className="text-sm font-medium">
                Data
              </label>
              <Input
                id="sq-from"
                type="date"
                className="h-10 w-auto"
                value={submittedFrom}
                onChange={(event) =>
                  patch({ submittedFrom: event.target.value || undefined })
                }
              />
            </div>
            <span className="text-muted-foreground pb-2 text-xs" aria-hidden>
              até
            </span>
            <Input
              id="sq-to"
              type="date"
              className="h-10 w-auto"
              aria-label="Data final"
              value={submittedTo}
              onChange={(event) =>
                patch({ submittedTo: event.target.value || undefined })
              }
            />
          </div>

          <Button type="button" variant="outline" onClick={applyTextFilters}>
            Filtrar
          </Button>
        </div>
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
          title={
            hasFilters
              ? "Nenhuma cotação encontrada"
              : "Nenhuma cotação recebida ainda"
          }
          description={
            hasFilters
              ? "Tente ajustar os filtros ou limpar a busca."
              : "Quando um comprador profissional solicitar uma cotação, ela aparecerá aqui."
          }
          icon={<Receipt aria-hidden />}
          action={
            hasFilters ? (
              <Button type="button" variant="outline" onClick={clearFilters}>
                Limpar filtros
              </Button>
            ) : undefined
          }
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

      {!listQuery.isLoading && !listQuery.isError && items.length > 0 ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <label
              htmlFor="sq-page-size"
              className="text-small text-muted-foreground whitespace-nowrap"
            >
              Itens por página
            </label>
            <select
              id="sq-page-size"
              className={cn(selectClassName, "h-8 w-auto")}
              value={pageSize}
              onChange={(event) => {
                const next = parseQuotationPageSize(event.target.value);
                patch({
                  pageSize:
                    next === QUOTATION_DEFAULT_PAGE_SIZE
                      ? undefined
                      : String(next),
                  page: "1",
                });
              }}
            >
              {QUOTATION_PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {totalPages > 1 ? (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(nextPage) => patch({ page: String(nextPage) })}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export { SellerQuotationsListView };
