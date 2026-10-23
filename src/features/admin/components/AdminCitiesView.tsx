"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Pencil, Plus } from "lucide-react";

import {
  AdminEmptyState,
  AdminFilterBar,
  AdminPage,
  AdminSearch,
  AdminSection,
  AdminStatusBadge,
  AdminTableSkeleton,
  ConfirmDialog,
} from "@/components/admin";
import { Pagination } from "@/components/navigation/Pagination";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type {
  AdminCityListItemDto,
  AdminCitySortParam,
} from "@/contracts/admin/cities";
import { CityFormDialog } from "@/features/admin/components/CityFormDialog";
import type { CityFormValues } from "@/features/admin/schemas/cityFormSchema";
import { useAdminCities } from "@/hooks/api/useAdminCities";
import { useCreateAdminCity } from "@/hooks/api/useCreateAdminCity";
import { useUpdateAdminCity } from "@/hooks/api/useUpdateAdminCity";
import { useUpdateAdminCityStatus } from "@/hooks/api/useUpdateAdminCityStatus";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import {
  mapAdminCityToForm,
  mapCityFormToCreateRequest,
  mapCityFormToUpdateRequest,
} from "@/mappers/city-form.mapper";
import { formatDate } from "@/utils/formatDate";
import { formatMetricCount } from "@/utils/formatMetrics";
import {
  adminCitiesHasActiveFilters,
  buildAdminCitiesHref,
  parseAdminCitiesFilters,
  toAdminCitiesApiParams,
  type AdminCitiesUrlFilters,
} from "@/utils/admin-cities-search";

const SORT_OPTIONS: { value: AdminCitySortParam; label: string }[] = [
  { value: "order", label: "Ordem" },
  { value: "name", label: "Nome" },
  { value: "sellerCount", label: "Vendedores" },
];

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

/**
 * Listagem administrativa de cidades — URL como fonte da verdade.
 * A ordem de cada cidade é editada no formulário.
 */
function AdminCitiesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseAdminCitiesFilters(searchParams);
  const apiParams = toAdminCitiesApiParams(filters);
  const citiesQuery = useAdminCities(apiParams);

  const createMutation = useCreateAdminCity();
  const updateMutation = useUpdateAdminCity();
  const statusMutation = useUpdateAdminCityStatus();

  const [searchDraft, setSearchDraft] = useState(filters.q ?? "");
  const [lastSearchQ, setLastSearchQ] = useState(filters.q);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingCity, setEditingCity] = useState<AdminCityListItemDto | null>(
    null,
  );
  const [statusTarget, setStatusTarget] = useState<AdminCityListItemDto | null>(
    null,
  );

  // Sincroniza a busca local a partir da URL durante a renderização.
  if (filters.q !== lastSearchQ) {
    setLastSearchQ(filters.q);
    setSearchDraft(filters.q ?? "");
  }

  const items = citiesQuery.data?.items ?? [];
  const currentPage = citiesQuery.data?.currentPage ?? filters.page ?? 1;
  const totalPages = Math.max(1, citiesQuery.data?.totalPages ?? 1);
  const hasFilters = adminCitiesHasActiveFilters(filters);
  const sort = filters.sort ?? "order";

  const applyFilters = useCallback(
    (next: AdminCitiesUrlFilters) => {
      router.push(buildAdminCitiesHref(next));
    },
    [router],
  );

  const patchFilters = useCallback(
    (patch: Partial<AdminCitiesUrlFilters>) => {
      applyFilters({
        ...filters,
        ...patch,
        page: patch.page ?? 1,
      });
    },
    [applyFilters, filters],
  );

  const openCreateDialog = () => {
    setFormMode("create");
    setEditingCity(null);
    setFormOpen(true);
  };

  const openEditDialog = (city: AdminCityListItemDto) => {
    setFormMode("edit");
    setEditingCity(city);
    setFormOpen(true);
  };

  const formDefaultValues: CityFormValues | undefined = useMemo(
    () => (editingCity ? mapAdminCityToForm(editingCity) : undefined),
    [editingCity],
  );

  const submitError = createMutation.isError
    ? createMutation.error
    : updateMutation.isError
      ? updateMutation.error
      : undefined;

  const handleFormSubmit = (values: CityFormValues) => {
    if (formMode === "create") {
      createMutation.mutate(mapCityFormToCreateRequest(values), {
        onSuccess: () => setFormOpen(false),
      });
      return;
    }

    if (!editingCity) return;
    updateMutation.mutate(
      { id: editingCity.id, ...mapCityFormToUpdateRequest(values) },
      { onSuccess: () => setFormOpen(false) },
    );
  };

  return (
    <AdminPage
      title="Cidades"
      description="Gerencie as cidades disponíveis para vendedores e filtros do marketplace."
      breadcrumb={[{ label: "Admin", href: ROUTES.ADMIN }, { label: "Cidades" }]}
      actions={
        <Button type="button" variant="primary" size="sm" onClick={openCreateDialog}>
          <Plus className="size-4" aria-hidden />
          Nova cidade
        </Button>
      }
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
              placeholder="Buscar cidade…"
              aria-label="Buscar cidades"
              onClear={() => {
                setSearchDraft("");
                patchFilters({ q: undefined });
              }}
            />
          </form>
        }
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="admin-cities-status">
              Status
            </label>
            <select
              id="admin-cities-status"
              className={selectClassName}
              value={filters.status ?? "all"}
              onChange={(event) => {
                const value = event.target.value;
                patchFilters({
                  status:
                    value === "all"
                      ? undefined
                      : (value as AdminCitiesUrlFilters["status"]),
                });
              }}
            >
              <option value="all">Status: todos</option>
              <option value="active">Ativa</option>
              <option value="inactive">Inativa</option>
            </select>
          </div>
        }
        sort={
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="admin-cities-sort">
              Ordenar por
            </label>
            <select
              id="admin-cities-sort"
              className={selectClassName}
              value={sort}
              onChange={(event) => {
                const value = event.target.value as AdminCitySortParam;
                patchFilters({ sort: value === "order" ? undefined : value });
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  Ordenar: {option.label}
                </option>
              ))}
            </select>
          </div>
        }
        actions={
          hasFilters ? (
            <Button type="button" variant="outline" size="sm" onClick={() => applyFilters({})}>
              Limpar filtros
            </Button>
          ) : null
        }
      />

      <AdminSection
        title="Listagem"
        description="A ordem de uma cidade é alterada na edição."
      >
        {citiesQuery.isError ? (
          <AdminEmptyState
            title="Não foi possível carregar as cidades"
            description={getFriendlyErrorMessage(citiesQuery.error)}
            icon={<MapPin aria-hidden />}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void citiesQuery.refetch();
                }}
              >
                Tentar novamente
              </Button>
            }
          />
        ) : citiesQuery.isLoading ? (
          <AdminTableSkeleton columns={7} />
        ) : items.length === 0 ? (
          <AdminEmptyState
            title={hasFilters ? "Nenhum resultado para os filtros aplicados" : "Nenhuma cidade cadastrada"}
            description={
              hasFilters
                ? "Ajuste a busca ou limpe os filtros para ver mais resultados."
                : "Crie a primeira cidade para vendedores e filtros do marketplace."
            }
            icon={<MapPin aria-hidden />}
            action={
              hasFilters ? null : (
                <Button type="button" variant="primary" size="sm" onClick={openCreateDialog}>
                  <Plus className="size-4" aria-hidden />
                  Nova cidade
                </Button>
              )
            }
          />
        ) : (
          <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <caption className="sr-only">Cidades do marketplace</caption>
                <thead className="bg-muted/50 border-border border-b">
                  <tr>
                    <th
                      scope="col"
                      className="text-muted-foreground px-4 py-3 text-xs font-semibold tracking-wide uppercase"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="text-muted-foreground px-4 py-3 text-xs font-semibold tracking-wide uppercase"
                    >
                      UF
                    </th>
                    <th
                      scope="col"
                      className="text-muted-foreground px-4 py-3 text-xs font-semibold tracking-wide uppercase"
                    >
                      Slug
                    </th>
                    <th
                      scope="col"
                      className="text-muted-foreground px-4 py-3 text-xs font-semibold tracking-wide uppercase"
                    >
                      Ordem
                    </th>
                    <th
                      scope="col"
                      className="text-muted-foreground px-4 py-3 text-xs font-semibold tracking-wide uppercase"
                    >
                      Vendedores
                    </th>
                    <th
                      scope="col"
                      className="text-muted-foreground px-4 py-3 text-xs font-semibold tracking-wide uppercase"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="text-muted-foreground px-4 py-3 text-xs font-semibold tracking-wide uppercase"
                    >
                      Atualizado
                    </th>
                    <th
                      scope="col"
                      className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wide uppercase"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {items.map((city) => (
                    <tr
                      key={city.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="text-foreground px-4 py-3 font-medium">
                        {city.name}
                      </td>
                      <td className="text-foreground px-4 py-3 font-mono text-xs uppercase">
                        {city.state}
                      </td>
                      <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                        {city.slug}
                      </td>
                      <td className="text-foreground px-4 py-3 tabular-nums">
                        {city.displayOrder}
                      </td>
                      <td className="text-foreground px-4 py-3 tabular-nums">
                        {formatMetricCount(city.sellerCount)}
                      </td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge status={city.isActive ? "active" : "inactive"} />
                      </td>
                      <td className="text-foreground px-4 py-3">
                        {formatDate(city.updatedAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(city)}
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setStatusTarget(city)}
                          >
                            {city.isActive ? "Inativar" : "Ativar"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 ? (
              <div className="border-border border-t px-4 py-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => patchFilters({ page })}
                />
              </div>
            ) : null}
          </div>
        )}
      </AdminSection>

      <CityFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        defaultValues={formDefaultValues}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        submitError={submitError}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={statusTarget !== null}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
        title={statusTarget?.isActive ? "Inativar cidade?" : "Ativar cidade?"}
        description={
          statusTarget?.isActive
            ? `A cidade “${statusTarget.name}” deixará de aparecer nas listas públicas.`
            : `A cidade “${statusTarget?.name ?? ""}” voltará a aparecer nas listas públicas.`
        }
        confirmLabel={statusTarget?.isActive ? "Inativar" : "Ativar"}
        confirmVariant={statusTarget?.isActive ? "destructive" : "primary"}
        loading={statusMutation.isPending}
        onConfirm={() => {
          if (!statusTarget) return;
          statusMutation.mutate(
            { id: statusTarget.id, isActive: !statusTarget.isActive },
            { onSuccess: () => setStatusTarget(null) },
          );
        }}
      />
    </AdminPage>
  );
}

export { AdminCitiesView };
