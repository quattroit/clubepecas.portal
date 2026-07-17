"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ScrollText } from "lucide-react";

import {
  AdminEmptyState,
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminStatusBadge,
  AdminTable,
} from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin";
import { Pagination } from "@/components/navigation/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import type { AdminAuditListItemDto } from "@/contracts/admin/audit";
import { useAdminAuditLogs } from "@/hooks/api/useAdminAuditLogs";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";
import { formatMetricCount } from "@/utils/formatMetrics";
import {
  adminAuditHasActiveFilters,
  buildAdminAuditHref,
  parseAdminAuditFilters,
  toAdminAuditApiParams,
  type AdminAuditSuccessFilter,
  type AdminAuditUrlFilters,
} from "@/utils/admin-audit-search";

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

function formatUserLabel(row: AdminAuditListItemDto): string {
  return row.userEmail?.trim() || row.userFullName?.trim() || "—";
}

/**
 * Listagem administrativa de auditoria — URL como fonte da verdade.
 */
function AdminAuditView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseAdminAuditFilters(searchParams);
  const apiParams = toAdminAuditApiParams(filters);
  const auditQuery = useAdminAuditLogs(apiParams);

  const [actionDraft, setActionDraft] = useState(filters.action ?? "");

  useEffect(() => {
    setActionDraft(filters.action ?? "");
  }, [filters.action]);

  const applyFilters = useCallback(
    (next: AdminAuditUrlFilters) => {
      router.push(buildAdminAuditHref(next));
    },
    [router],
  );

  const patchFilters = useCallback(
    (patch: Partial<AdminAuditUrlFilters>) => {
      applyFilters({
        ...filters,
        ...patch,
        page: patch.page ?? 1,
      });
    },
    [applyFilters, filters],
  );

  const hasFilters = adminAuditHasActiveFilters(filters);
  const items = auditQuery.data?.items ?? [];
  const totalItems = auditQuery.data?.totalItems ?? 0;
  const currentPage = auditQuery.data?.currentPage ?? filters.page ?? 1;
  const totalPages = Math.max(1, auditQuery.data?.totalPages ?? 1);

  const columns: AdminTableColumn<AdminAuditListItemDto>[] = [
    {
      id: "occurredAt",
      header: "Data/Hora",
      accessor: (row) => formatDate(row.occurredAtUtc),
      className: "whitespace-nowrap tabular-nums",
    },
    {
      id: "user",
      header: "Usuário",
      cell: (row) => (
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate font-medium" title={formatUserLabel(row)}>
            {formatUserLabel(row)}
          </span>
          {row.userEmail && row.userFullName ? (
            <span className="text-muted-foreground truncate text-xs">
              {row.userFullName}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      id: "action",
      header: "Ação",
      cell: (row) => (
        <span className="font-mono text-xs">{row.action}</span>
      ),
    },
    {
      id: "description",
      header: "Descrição",
      cell: (row) => (
        <span className="line-clamp-2 max-w-[20rem]" title={row.description}>
          {row.description}
        </span>
      ),
    },
    {
      id: "ip",
      header: "IP",
      accessor: (row) => row.ipAddress ?? "—",
      className: "font-mono text-xs tabular-nums",
    },
    {
      id: "result",
      header: "Resultado",
      cell: (row) => (
        <AdminStatusBadge
          status={row.success ? "active" : "blocked"}
          label={row.success ? "Sucesso" : "Falha"}
        />
      ),
    },
  ];

  return (
    <AdminPage
      title="Auditoria"
      description="Consulte o histórico de ações administrativas e eventos de segurança."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Auditoria" },
      ]}
    >
      <AdminFilterBar
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground text-xs font-medium whitespace-nowrap">
                Período
              </span>
              <Input
                id="admin-audit-from"
                type="date"
                aria-label="Data inicial"
                title="Data inicial"
                className="h-10 w-auto"
                value={filters.from ?? ""}
                onChange={(event) => {
                  patchFilters({
                    from: event.target.value || undefined,
                  });
                }}
              />
              <span className="text-muted-foreground text-xs" aria-hidden>
                até
              </span>
              <Input
                id="admin-audit-to"
                type="date"
                aria-label="Data final"
                title="Data final"
                className="h-10 w-auto"
                value={filters.to ?? ""}
                onChange={(event) => {
                  patchFilters({
                    to: event.target.value || undefined,
                  });
                }}
              />
            </div>

            <form
              className="w-full max-w-xs sm:w-auto"
              onSubmit={(event) => {
                event.preventDefault();
                patchFilters({
                  action: actionDraft.trim() || undefined,
                });
              }}
            >
              <label className="sr-only" htmlFor="admin-audit-action">
                Ação
              </label>
              <Input
                id="admin-audit-action"
                type="text"
                placeholder="Ação (ex.: login.failed)"
                aria-label="Filtrar por ação"
                className="h-10"
                value={actionDraft}
                onChange={(event) => setActionDraft(event.target.value)}
                onBlur={() => {
                  const action = actionDraft.trim();
                  if (action !== (filters.action ?? "")) {
                    patchFilters({ action: action || undefined });
                  }
                }}
              />
            </form>

            <label className="sr-only" htmlFor="admin-audit-success">
              Resultado
            </label>
            <select
              id="admin-audit-success"
              className={selectClassName}
              value={filters.success ?? "all"}
              onChange={(event) => {
                const value = event.target.value as AdminAuditSuccessFilter;
                patchFilters({
                  success: value === "all" ? undefined : value,
                });
              }}
            >
              <option value="all">Resultado: todos</option>
              <option value="true">Sucesso</option>
              <option value="false">Falha</option>
            </select>
          </div>
        }
        actions={
          hasFilters ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyFilters({})}
            >
              Limpar filtros
            </Button>
          ) : null
        }
      />

      <AdminSection
        title="Listagem"
        description={
          auditQuery.isSuccess
            ? `${formatMetricCount(totalItems)} registro${totalItems === 1 ? "" : "s"}`
            : "Resultados dos filtros aplicados."
        }
      >
        {auditQuery.isError ? (
          <AdminEmptyState
            title="Não foi possível carregar a auditoria"
            description={getFriendlyErrorMessage(auditQuery.error)}
            icon={<ScrollText aria-hidden />}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void auditQuery.refetch();
                }}
              >
                Tentar novamente
              </Button>
            }
          />
        ) : (
          <AdminTable
            columns={columns}
            data={items}
            getRowId={(row) => row.id}
            loading={auditQuery.isLoading}
            caption="Logs de auditoria"
            emptyTitle={
              hasFilters
                ? "Nenhum resultado para os filtros aplicados"
                : "Nenhum registro de auditoria"
            }
            emptyDescription={
              hasFilters
                ? "Ajuste o período, a ação ou o resultado e tente novamente."
                : "Assim que houver eventos registrados, eles aparecerão aqui."
            }
            pagination={
              totalPages > 1 ? (
                <div className="border-border border-t px-4 py-3">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => patchFilters({ page })}
                  />
                </div>
              ) : null
            }
          />
        )}
      </AdminSection>
    </AdminPage>
  );
}

export { AdminAuditView };
