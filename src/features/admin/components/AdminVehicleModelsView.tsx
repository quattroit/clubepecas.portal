"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CarFront, Pencil, Plus } from "lucide-react";

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
  AdminVehicleModelListItemDto,
  AdminVehicleModelSortParam,
} from "@/contracts/admin/vehicle-models";
import { VehicleModelFormDialog } from "@/features/admin/components/VehicleModelFormDialog";
import {
  vehicleModelFormDefaultValues,
  type VehicleModelFormValues,
} from "@/features/admin/schemas/vehicleModelFormSchema";
import { useAdminVehicleModels } from "@/hooks/api/useAdminVehicleModels";
import { useCreateAdminVehicleModel } from "@/hooks/api/useCreateAdminVehicleModel";
import { useUpdateAdminVehicleModel } from "@/hooks/api/useUpdateAdminVehicleModel";
import { useUpdateAdminVehicleModelStatus } from "@/hooks/api/useUpdateAdminVehicleModelStatus";
import { useVehicleBrands } from "@/hooks/api/useVehicleBrands";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import {
  mapAdminVehicleModelToForm,
  mapVehicleModelFormToCreateRequest,
  mapVehicleModelFormToUpdateRequest,
} from "@/mappers/vehicle-model-form.mapper";
import { formatDate } from "@/utils/formatDate";
import { formatMetricCount } from "@/utils/formatMetrics";
import {
  adminVehicleModelsHasActiveFilters,
  buildAdminVehicleModelsHref,
  parseAdminVehicleModelsFilters,
  toAdminVehicleModelsApiParams,
  type AdminVehicleModelsUrlFilters,
} from "@/utils/admin-vehicle-models-search";

const SORT_OPTIONS: { value: AdminVehicleModelSortParam; label: string }[] = [
  { value: "order", label: "Ordem" },
  { value: "name", label: "Nome" },
  { value: "advertisementCount", label: "Anúncios" },
];

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

/**
 * Listagem administrativa de modelos de veículo — URL como fonte da verdade.
 * A ordem de cada modelo é editada no formulário.
 */
function AdminVehicleModelsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseAdminVehicleModelsFilters(searchParams);
  const apiParams = toAdminVehicleModelsApiParams(filters);
  const modelsQuery = useAdminVehicleModels(apiParams);
  const brandsQuery = useVehicleBrands();

  const createMutation = useCreateAdminVehicleModel();
  const updateMutation = useUpdateAdminVehicleModel();
  const statusMutation = useUpdateAdminVehicleModelStatus();

  const [searchDraft, setSearchDraft] = useState(filters.q ?? "");
  const [lastSearchQ, setLastSearchQ] = useState(filters.q);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingModel, setEditingModel] =
    useState<AdminVehicleModelListItemDto | null>(null);
  const [statusTarget, setStatusTarget] =
    useState<AdminVehicleModelListItemDto | null>(null);

  if (filters.q !== lastSearchQ) {
    setLastSearchQ(filters.q);
    setSearchDraft(filters.q ?? "");
  }

  const items = modelsQuery.data?.items ?? [];
  const currentPage = modelsQuery.data?.currentPage ?? filters.page ?? 1;
  const totalPages = Math.max(1, modelsQuery.data?.totalPages ?? 1);
  const hasFilters = adminVehicleModelsHasActiveFilters(filters);
  const sort = filters.sort ?? "order";

  const applyFilters = useCallback(
    (next: AdminVehicleModelsUrlFilters) => {
      router.push(buildAdminVehicleModelsHref(next));
    },
    [router],
  );

  const patchFilters = useCallback(
    (patch: Partial<AdminVehicleModelsUrlFilters>) => {
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
    setEditingModel(null);
    setFormOpen(true);
  };

  const openEditDialog = (model: AdminVehicleModelListItemDto) => {
    setFormMode("edit");
    setEditingModel(model);
    setFormOpen(true);
  };

  const formDefaultValues: VehicleModelFormValues | undefined = useMemo(() => {
    if (editingModel) return mapAdminVehicleModelToForm(editingModel);
    if (filters.brandId) {
      return {
        ...vehicleModelFormDefaultValues,
        vehicleBrandId: filters.brandId,
      };
    }
    return undefined;
  }, [editingModel, filters.brandId]);

  const submitError = createMutation.isError
    ? createMutation.error
    : updateMutation.isError
      ? updateMutation.error
      : undefined;

  const handleFormSubmit = (values: VehicleModelFormValues) => {
    if (formMode === "create") {
      createMutation.mutate(mapVehicleModelFormToCreateRequest(values), {
        onSuccess: () => setFormOpen(false),
      });
      return;
    }

    if (!editingModel) return;
    updateMutation.mutate(
      { id: editingModel.id, ...mapVehicleModelFormToUpdateRequest(values) },
      { onSuccess: () => setFormOpen(false) },
    );
  };

  return (
    <AdminPage
      title="Modelos"
      description="Gerencie os modelos de veículo disponíveis para anúncios e filtros do marketplace."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Modelos" },
      ]}
      actions={
        <Button type="button" variant="primary" size="sm" onClick={openCreateDialog}>
          <Plus className="size-4" aria-hidden />
          Novo modelo
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
              placeholder="Buscar modelo…"
              aria-label="Buscar modelos"
              onClear={() => {
                setSearchDraft("");
                patchFilters({ q: undefined });
              }}
            />
          </form>
        }
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="admin-vehicle-models-brand">
              Marca
            </label>
            <select
              id="admin-vehicle-models-brand"
              className={selectClassName}
              value={filters.brandId ?? "all"}
              onChange={(event) => {
                const value = event.target.value;
                patchFilters({
                  brandId: value === "all" ? undefined : Number(value),
                });
              }}
            >
              <option value="all">Marca: todas</option>
              {(brandsQuery.data ?? []).map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="admin-vehicle-models-status">
              Status
            </label>
            <select
              id="admin-vehicle-models-status"
              className={selectClassName}
              value={filters.status ?? "all"}
              onChange={(event) => {
                const value = event.target.value;
                patchFilters({
                  status:
                    value === "all"
                      ? undefined
                      : (value as AdminVehicleModelsUrlFilters["status"]),
                });
              }}
            >
              <option value="all">Status: todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        }
        sort={
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="admin-vehicle-models-sort">
              Ordenar por
            </label>
            <select
              id="admin-vehicle-models-sort"
              className={selectClassName}
              value={sort}
              onChange={(event) => {
                const value = event.target.value as AdminVehicleModelSortParam;
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
        description="A ordem de um modelo é alterada na edição."
      >
        {modelsQuery.isError ? (
          <AdminEmptyState
            title="Não foi possível carregar os modelos"
            description={getFriendlyErrorMessage(modelsQuery.error)}
            icon={<CarFront aria-hidden />}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void modelsQuery.refetch();
                }}
              >
                Tentar novamente
              </Button>
            }
          />
        ) : modelsQuery.isLoading ? (
          <AdminTableSkeleton columns={8} />
        ) : items.length === 0 ? (
          <AdminEmptyState
            title={
              hasFilters
                ? "Nenhum resultado para os filtros aplicados"
                : "Nenhum modelo cadastrado"
            }
            description={
              hasFilters
                ? "Ajuste a busca ou limpe os filtros para ver mais resultados."
                : "Crie o primeiro modelo para anúncios e filtros do marketplace."
            }
            icon={<CarFront aria-hidden />}
            action={
              hasFilters ? null : (
                <Button type="button" variant="primary" size="sm" onClick={openCreateDialog}>
                  <Plus className="size-4" aria-hidden />
                  Novo modelo
                </Button>
              )
            }
          />
        ) : (
          <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] text-left text-sm">
                <caption className="sr-only">Modelos de veículo do marketplace</caption>
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
                      Marca
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
                      Anúncios
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
                  {items.map((model) => (
                    <tr
                      key={model.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="text-foreground px-4 py-3 font-medium">
                        {model.name}
                      </td>
                      <td className="text-foreground px-4 py-3">
                        {model.vehicleBrandName}
                      </td>
                      <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                        {model.slug}
                      </td>
                      <td className="text-foreground px-4 py-3 tabular-nums">
                        {model.displayOrder}
                      </td>
                      <td className="text-foreground px-4 py-3 tabular-nums">
                        {formatMetricCount(model.advertisementCount)}
                      </td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge status={model.isActive ? "active" : "inactive"} />
                      </td>
                      <td className="text-foreground px-4 py-3">
                        {formatDate(model.updatedAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(model)}
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setStatusTarget(model)}
                          >
                            {model.isActive ? "Inativar" : "Ativar"}
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

      <VehicleModelFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        defaultValues={formDefaultValues}
        brands={brandsQuery.data ?? []}
        brandsLoading={brandsQuery.isLoading}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        submitError={submitError}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={statusTarget !== null}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
        title={statusTarget?.isActive ? "Inativar modelo?" : "Ativar modelo?"}
        description={
          statusTarget?.isActive
            ? `O modelo “${statusTarget.name}” deixará de aparecer nas listas públicas.`
            : `O modelo “${statusTarget?.name ?? ""}” voltará a aparecer nas listas públicas.`
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

export { AdminVehicleModelsView };
