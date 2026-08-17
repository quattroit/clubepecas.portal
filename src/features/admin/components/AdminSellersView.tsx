"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Eye, Store } from "lucide-react";

import {
  AdminEmptyState,
  AdminFilterBar,
  AdminPage,
  AdminSearch,
  AdminSection,
  AdminStatusBadge,
  AdminTable,
  ConfirmDialog,
} from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin";
import { Pagination } from "@/components/navigation/Pagination";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminSellerPath,
  ROUTES,
  storePath,
} from "@/constants/routes";
import type {
  AdminSellerListItemDto,
  AdminSellerPlanFilter,
  AdminSellerSortParam,
  AdminSellerStatusFilter,
} from "@/contracts/admin/sellers";
import { useAdminSellers } from "@/hooks/api/useAdminSellers";
import { useUpdateAdminSellerStatus } from "@/hooks/api/useUpdateAdminSellerStatus";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";
import {
  formatConversionRate,
  formatMetricCount,
} from "@/utils/formatMetrics";
import {
  adminSellerHasActiveFilters,
  buildAdminSellersHref,
  parseAdminSellersFilters,
  toAdminSellersApiParams,
  type AdminSellersUrlFilters,
} from "@/utils/admin-sellers-search";

const SORT_OPTIONS: { value: AdminSellerSortParam; label: string }[] = [
  { value: "createdAt", label: "Cadastro" },
  { value: "name", label: "Nome" },
  { value: "lastAccess", label: "Último acesso" },
  { value: "advertisementCount", label: "Anúncios" },
  { value: "views", label: "Visualizações" },
  { value: "conversion", label: "Conversão" },
];

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

function formatLastAccess(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Listagem administrativa de vendedores — URL como fonte da verdade.
 */
function AdminSellersView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseAdminSellersFilters(searchParams);
  const apiParams = toAdminSellersApiParams(filters);
  const sellersQuery = useAdminSellers(apiParams);
  const updateStatus = useUpdateAdminSellerStatus();

  const [searchDraft, setSearchDraft] = useState(filters.q ?? "");
  const [statusTarget, setStatusTarget] = useState<AdminSellerListItemDto | null>(
    null,
  );

  useEffect(() => {
    setSearchDraft(filters.q ?? "");
  }, [filters.q]);

  const applyFilters = useCallback(
    (next: AdminSellersUrlFilters) => {
      router.push(buildAdminSellersHref(next));
    },
    [router],
  );

  const patchFilters = useCallback(
    (patch: Partial<AdminSellersUrlFilters>) => {
      applyFilters({
        ...filters,
        ...patch,
        page: patch.page ?? 1,
      });
    },
    [applyFilters, filters],
  );

  const hasFilters = adminSellerHasActiveFilters(filters);
  const items = sellersQuery.data?.items ?? [];
  const totalItems = sellersQuery.data?.totalItems ?? 0;
  const currentPage = sellersQuery.data?.currentPage ?? filters.page ?? 1;
  const totalPages = Math.max(1, sellersQuery.data?.totalPages ?? 1);

  const columns: AdminTableColumn<AdminSellerListItemDto>[] = [
    {
      id: "store",
      header: "Loja",
      cell: (row) => (
        <div className="flex min-w-0 flex-col gap-0.5">
          <Link
            href={adminSellerPath(row.id)}
            className="text-foreground hover:text-primary truncate font-medium underline-offset-2 hover:underline"
          >
            {row.storeName}
          </Link>
        </div>
      ),
    },
    {
      id: "location",
      header: "Cidade / UF",
      accessor: (row) => `${row.city} — ${row.state}`,
    },
    {
      id: "email",
      header: "E-mail",
      cell: (row) => (
        <span className="block max-w-[12rem] truncate" title={row.email}>
          {row.email}
        </span>
      ),
    },
    {
      id: "representative",
      header: "Representante",
      cell: (row) =>
        row.representativeCode ? (
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm">{row.representativeName}</span>
            <span className="text-muted-foreground font-mono text-xs">
              {row.representativeCode}
            </span>
          </div>
        ) : (
          "—"
        ),
    },
    {
      id: "personType",
      header: "Tipo",
      accessor: (row) =>
        row.personType === 2
          ? "PJ"
          : row.personType === 1
            ? "PF"
            : "—",
    },
    {
      id: "document",
      header: "CPF/CNPJ",
      cell: (row) => (
        <span className="font-mono text-xs tabular-nums">
          {row.document ?? "—"}
        </span>
      ),
    },
    {
      id: "createdAt",
      header: "Cadastro",
      accessor: (row) => formatDate(row.createdAt),
    },
    {
      id: "lastAccess",
      header: "Último acesso",
      accessor: (row) => formatLastAccess(row.lastAccessAt),
    },
    {
      id: "ads",
      header: "Anúncios",
      accessor: (row) => formatMetricCount(row.advertisementCount),
      className: "tabular-nums",
    },
    {
      id: "views",
      header: "Views",
      accessor: (row) => formatMetricCount(row.views),
      className: "tabular-nums",
    },
    {
      id: "conversion",
      header: "Conv.",
      accessor: (row) => formatConversionRate(row.conversionRate),
      className: "tabular-nums",
    },
    {
      id: "plan",
      header: "Plano",
      cell: (row) => <AdminStatusBadge status="basic" label={row.planLabel} />,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <AdminStatusBadge status={row.isActive ? "active" : "inactive"} />
      ),
    },
  ];

  return (
    <AdminPage
      title="Vendedores"
      description="Gerencie contas, status e desempenho dos vendedores."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Vendedores" },
      ]}
    >
      <AdminFilterBar
        search={
          <form
            className="w-full max-w-sm"
            onSubmit={(event) => {
              event.preventDefault();
              patchFilters({ q: searchDraft.trim() || undefined });
            }}
          >
            <AdminSearch
              value={searchDraft}
              onChange={setSearchDraft}
              placeholder="Buscar loja, nome, e-mail…"
              aria-label="Buscar vendedores"
              onClear={() => {
                setSearchDraft("");
                patchFilters({ q: undefined });
              }}
            />
          </form>
        }
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="admin-sellers-status">
              Status
            </label>
            <select
              id="admin-sellers-status"
              className={selectClassName}
              value={filters.status ?? "all"}
              onChange={(event) => {
                const value = event.target.value as AdminSellerStatusFilter;
                patchFilters({
                  status: value === "all" ? undefined : value,
                });
              }}
            >
              <option value="all">Status: todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>

            <label className="sr-only" htmlFor="admin-sellers-plan">
              Plano
            </label>
            <select
              id="admin-sellers-plan"
              className={selectClassName}
              value={filters.plan ?? "all"}
              onChange={(event) => {
                const value = event.target.value as AdminSellerPlanFilter;
                patchFilters({
                  plan: value === "all" ? undefined : value,
                });
              }}
            >
              <option value="all">Plano: todos</option>
              <option value="basic">Básico</option>
              <option value="intermediate">Intermediário</option>
              <option value="premium">Premium</option>
            </select>

            <Input
              type="text"
              placeholder="Cidade"
              aria-label="Filtrar por cidade"
              className="h-10 w-28 sm:w-36"
              defaultValue={filters.city ?? ""}
              key={`city-${filters.city ?? ""}`}
              onBlur={(event) => {
                const city = event.target.value.trim();
                if (city !== (filters.city ?? "")) {
                  patchFilters({ city: city || undefined });
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const city = (
                    event.target as HTMLInputElement
                  ).value.trim();
                  patchFilters({ city: city || undefined });
                }
              }}
            />

            <Input
              type="text"
              placeholder="UF"
              aria-label="Filtrar por estado"
              className="h-10 w-16 uppercase"
              maxLength={2}
              defaultValue={filters.state ?? ""}
              key={`state-${filters.state ?? ""}`}
              onBlur={(event) => {
                const state = event.target.value.trim().toUpperCase();
                if (state !== (filters.state ?? "")) {
                  patchFilters({ state: state || undefined });
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const state = (
                    event.target as HTMLInputElement
                  ).value.trim().toUpperCase();
                  patchFilters({ state: state || undefined });
                }
              }}
            />

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground text-xs font-medium whitespace-nowrap">
                Cadastro
              </span>
              <Input
                id="admin-sellers-created-from"
                type="date"
                aria-label="Cadastro a partir de"
                title="Cadastro a partir de"
                className="h-10 w-auto"
                value={filters.createdFrom ?? ""}
                onChange={(event) => {
                  patchFilters({
                    createdFrom: event.target.value || undefined,
                  });
                }}
              />
              <span className="text-muted-foreground text-xs" aria-hidden>
                até
              </span>
              <Input
                id="admin-sellers-created-to"
                type="date"
                aria-label="Cadastro até"
                title="Cadastro até"
                className="h-10 w-auto"
                value={filters.createdTo ?? ""}
                onChange={(event) => {
                  patchFilters({
                    createdTo: event.target.value || undefined,
                  });
                }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground text-xs font-medium whitespace-nowrap">
                Último acesso
              </span>
              <Input
                id="admin-sellers-last-access-from"
                type="date"
                aria-label="Último acesso a partir de"
                title="Último acesso a partir de"
                className="h-10 w-auto"
                value={filters.lastAccessFrom ?? ""}
                onChange={(event) => {
                  patchFilters({
                    lastAccessFrom: event.target.value || undefined,
                  });
                }}
              />
              <span className="text-muted-foreground text-xs" aria-hidden>
                até
              </span>
              <Input
                id="admin-sellers-last-access-to"
                type="date"
                aria-label="Último acesso até"
                title="Último acesso até"
                className="h-10 w-auto"
                value={filters.lastAccessTo ?? ""}
                onChange={(event) => {
                  patchFilters({
                    lastAccessTo: event.target.value || undefined,
                  });
                }}
              />
            </div>
          </div>
        }
        sort={
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="admin-sellers-sort">
              Ordenar por
            </label>
            <select
              id="admin-sellers-sort"
              className={selectClassName}
              value={filters.sort ?? "createdAt"}
              onChange={(event) => {
                const sort = event.target.value as AdminSellerSortParam;
                patchFilters({
                  sort: sort === "createdAt" ? undefined : sort,
                  sortDir:
                    sort === "name"
                      ? "asc"
                      : filters.sortDir ?? "desc",
                });
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  Ordenar: {option.label}
                </option>
              ))}
            </select>
            <select
              className={selectClassName}
              aria-label="Direção da ordenação"
              value={
                filters.sortDir ??
                ((filters.sort ?? "createdAt") === "name" ? "asc" : "desc")
              }
              onChange={(event) => {
                patchFilters({
                  sortDir: event.target.value as "asc" | "desc",
                  sort: filters.sort ?? "createdAt",
                });
              }}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
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
          sellersQuery.isSuccess
            ? `${formatMetricCount(totalItems)} vendedor${totalItems === 1 ? "" : "es"}`
            : "Resultados da busca e filtros aplicados."
        }
      >
        {sellersQuery.isError ? (
          <AdminEmptyState
            title="Não foi possível carregar os vendedores"
            description={getFriendlyErrorMessage(sellersQuery.error)}
            icon={<Store aria-hidden />}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void sellersQuery.refetch();
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
            loading={sellersQuery.isLoading}
            caption="Vendedores da plataforma"
            emptyTitle={
              hasFilters
                ? "Nenhum resultado para os filtros aplicados"
                : "Nenhum vendedor encontrado"
            }
            emptyDescription={
              hasFilters
                ? "Ajuste a busca ou limpe os filtros para ver mais resultados."
                : "Assim que houver cadastros, eles aparecerão aqui."
            }
            rowActions={(row) => (
              <div className="flex flex-wrap items-center justify-end gap-1">
                <Link
                  href={adminSellerPath(row.id)}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                  )}
                >
                  <Eye className="size-3.5" aria-hidden />
                  Detalhes
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStatusTarget(row)}
                >
                  {row.isActive ? "Inativar" : "Ativar"}
                </Button>
                <Link
                  href={storePath(row.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                  )}
                >
                  Loja
                </Link>
              </div>
            )}
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

      <ConfirmDialog
        open={statusTarget !== null}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
        title={
          statusTarget?.isActive
            ? "Inativar vendedor?"
            : "Ativar vendedor?"
        }
        description={
          statusTarget?.isActive
            ? `A loja “${statusTarget.storeName}” ficará inativa no marketplace. Os anúncios deixarão de aparecer publicamente.`
            : `A loja “${statusTarget?.storeName ?? ""}” voltará a aparecer no marketplace.`
        }
        confirmLabel={statusTarget?.isActive ? "Inativar" : "Ativar"}
        confirmVariant={statusTarget?.isActive ? "destructive" : "primary"}
        loading={updateStatus.isPending}
        onConfirm={() => {
          if (!statusTarget) return;
          updateStatus.mutate(
            {
              id: statusTarget.id,
              isActive: !statusTarget.isActive,
            },
            {
              onSuccess: () => setStatusTarget(null),
            },
          );
        }}
      />
    </AdminPage>
  );
}

export { AdminSellersView };
