"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipboardList, Eye, Pencil, Plus, XCircle } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { PageLoader } from "@/components/feedback/PageLoader";
import { Pagination } from "@/components/navigation/Pagination";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { CancelPartRequestDialog } from "@/features/professional-buyer/components/CancelPartRequestDialog";
import { PartRequestStatusBadge } from "@/features/professional-buyer/components/PartRequestStatusBadge";
import { PART_REQUEST_OUTCOME_FILTER_OPTIONS, getPartRequestOutcomeBadgeVariant } from "@/features/professional-buyer/utils/partRequestOutcome";
import { PART_REQUEST_STATUS_FILTER_OPTIONS } from "@/features/professional-buyer/utils/partRequestStatus";
import {
  ROUTES,
  editProfessionalBuyerPartRequestPath,
  professionalBuyerPartRequestPath,
} from "@/constants/routes";
import type {
  PartRequestDto,
  PartRequestOutcomeFilter,
  PartRequestStatusFilter,
} from "@/contracts/part-requests";
import {
  isPartRequestCancellable,
  isPartRequestEditable,
} from "@/contracts/part-requests";
import { Badge } from "@/components/ui/badge";
import { useCancelPartRequest } from "@/hooks/api/useCancelPartRequest";
import { useMyPartRequests } from "@/hooks/api/useMyPartRequests";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";
import { formatCityLabel } from "@/mappers/city.mapper";

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

function PartRequestsListView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const q = searchParams.get("q") ?? "";
  const status =
    (searchParams.get("status") as PartRequestStatusFilter | null) ?? "all";
  const outcome =
    (searchParams.get("outcome") as PartRequestOutcomeFilter | null) ?? "all";

  const [qDraft, setQDraft] = useState(q);
  const [pendingCancel, setPendingCancel] = useState<PartRequestDto | null>(null);

  const params = useMemo(
    () => ({
      page,
      pageSize: 20,
      q: q || undefined,
      status: status === "all" ? undefined : status,
      outcome: outcome === "all" ? undefined : outcome,
    }),
    [page, q, status, outcome],
  );

  const listQuery = useMyPartRequests(params);
  const cancelMutation = useCancelPartRequest();

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
        ? `${ROUTES.PROFESSIONAL_BUYER_PART_REQUESTS}?${qs}`
        : ROUTES.PROFESSIONAL_BUYER_PART_REQUESTS,
    );
  };

  const items = listQuery.data?.items ?? [];
  const totalPages = Math.max(1, listQuery.data?.totalPages ?? 1);
  const hasFilters = Boolean(q || status !== "all" || outcome !== "all");

  const handleConfirmCancel = () => {
    if (!pendingCancel) return;
    cancelMutation.mutate(pendingCancel.id, {
      onSuccess: () => setPendingCancel(null),
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-h1">Solicitações</h1>
          <p className="text-small text-muted-foreground">
            Gerencie suas solicitações de peças para fornecedores.
          </p>
        </div>

        <Link
          href={ROUTES.PROFESSIONAL_BUYER_PART_REQUEST_NEW}
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "shrink-0",
          )}
        >
          <Plus aria-hidden />
          Nova solicitação
        </Link>
      </div>

      <div className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-4 shadow-xs sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="pr-search" className="text-sm font-medium">
            Buscar
          </label>
          <Input
            id="pr-search"
            value={qDraft}
            onChange={(event) => setQDraft(event.target.value)}
            placeholder="Título, marca, modelo…"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                patch({ q: qDraft.trim() || undefined });
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:w-48">
          <label htmlFor="pr-status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="pr-status"
            className={selectClassName}
            value={status}
            onChange={(event) =>
              patch({ status: event.target.value || undefined })
            }
          >
            {PART_REQUEST_STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 sm:w-48">
          <label htmlFor="pr-outcome" className="text-sm font-medium">
            Resultado
          </label>
          <select
            id="pr-outcome"
            className={selectClassName}
            value={outcome}
            onChange={(event) =>
              patch({ outcome: event.target.value || undefined })
            }
          >
            {PART_REQUEST_OUTCOME_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => patch({ q: qDraft.trim() || undefined })}
        >
          Filtrar
        </Button>
      </div>

      {listQuery.isLoading ? <PageLoader label="Carregando solicitações…" /> : null}

      {listQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar as solicitações"
          message={getFriendlyErrorMessage(listQuery.error)}
        />
      ) : null}

      {!listQuery.isLoading &&
      !listQuery.isError &&
      items.length === 0 ? (
        <EmptyState
          title={hasFilters ? "Nenhuma solicitação encontrada" : "Nenhuma solicitação ainda"}
          description={
            hasFilters
              ? "Tente ajustar os filtros ou limpar a busca."
              : "Crie sua primeira solicitação para encontrar fornecedores."
          }
          icon={<ClipboardList aria-hidden />}
          action={
            hasFilters ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setQDraft("");
                  patch({
                    q: undefined,
                    status: undefined,
                    outcome: undefined,
                    page: "1",
                  });
                }}
              >
                Limpar filtros
              </Button>
            ) : (
              <Link
                href={ROUTES.PROFESSIONAL_BUYER_PART_REQUEST_NEW}
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Nova solicitação
              </Link>
            )
          }
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && items.length > 0 ? (
        <div className="border-border overflow-hidden rounded-2xl border shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted/40 border-border border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Título</th>
                  <th className="px-4 py-3 text-left font-medium">Veículo</th>
                  <th className="px-4 py-3 text-left font-medium">Cidade</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Resultado</th>
                  <th className="px-4 py-3 text-left font-medium">Criada em</th>
                  <th className="px-4 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-border hover:bg-muted/20 border-b last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium">{item.title}</td>
                    <td className="text-muted-foreground px-4 py-3">
                      {[item.vehicleBrandName, item.vehicleModelName, item.manufacturingYear]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {formatCityLabel({
                        name: item.cityName,
                        state: item.cityState,
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <PartRequestStatusBadge
                        status={item.status}
                        label={item.statusLabel}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={getPartRequestOutcomeBadgeVariant(item.outcome)}
                      >
                        {item.outcomeLabel}
                      </Badge>
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={professionalBuyerPartRequestPath(item.id)}
                          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                          aria-label={`Ver solicitação ${item.title}`}
                        >
                          <Eye className="size-4" aria-hidden />
                        </Link>
                        {isPartRequestEditable(item.status) ? (
                          <Link
                            href={editProfessionalBuyerPartRequestPath(item.id)}
                            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                            aria-label={`Editar solicitação ${item.title}`}
                          >
                            <Pencil className="size-4" aria-hidden />
                          </Link>
                        ) : null}
                        {isPartRequestCancellable(item.status) ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Cancelar solicitação ${item.title}`}
                            disabled={
                              cancelMutation.isPending &&
                              pendingCancel?.id === item.id
                            }
                            onClick={() => setPendingCancel(item)}
                          >
                            <XCircle className="text-destructive size-4" aria-hidden />
                          </Button>
                        ) : null}
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
          onPageChange={(nextPage) => patch({ page: String(nextPage) })}
        />
      ) : null}

      <CancelPartRequestDialog
        open={Boolean(pendingCancel)}
        requestTitle={pendingCancel?.title}
        isCancelling={cancelMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setPendingCancel(null);
        }}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}

export { PartRequestsListView };
