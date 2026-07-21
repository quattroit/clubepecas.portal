"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Car, GripVertical, Pencil, Plus } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type {
  AdminVehicleBrandListItemDto,
  AdminVehicleBrandSortParam,
} from "@/contracts/admin/vehicle-brands";
import { VehicleBrandFormDialog } from "@/features/admin/components/VehicleBrandFormDialog";
import type { VehicleBrandFormValues } from "@/features/admin/schemas/vehicleBrandFormSchema";
import { useAdminVehicleBrands } from "@/hooks/api/useAdminVehicleBrands";
import { useCreateAdminVehicleBrand } from "@/hooks/api/useCreateAdminVehicleBrand";
import { useReorderAdminVehicleBrands } from "@/hooks/api/useReorderAdminVehicleBrands";
import { useUpdateAdminVehicleBrand } from "@/hooks/api/useUpdateAdminVehicleBrand";
import { useUpdateAdminVehicleBrandStatus } from "@/hooks/api/useUpdateAdminVehicleBrandStatus";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import {
  mapAdminVehicleBrandToForm,
  mapVehicleBrandFormToCreateRequest,
  mapVehicleBrandFormToUpdateRequest,
} from "@/mappers/vehicle-brand-form.mapper";
import { formatDate } from "@/utils/formatDate";
import { formatMetricCount } from "@/utils/formatMetrics";
import {
  adminVehicleBrandsHasActiveFilters,
  buildAdminVehicleBrandsHref,
  parseAdminVehicleBrandsFilters,
  toAdminVehicleBrandsApiParams,
  type AdminVehicleBrandsUrlFilters,
} from "@/utils/admin-vehicle-brands-search";

const SORT_OPTIONS: { value: AdminVehicleBrandSortParam; label: string }[] = [
  { value: "order", label: "Ordem" },
  { value: "name", label: "Nome" },
  { value: "advertisementCount", label: "Anúncios" },
];

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

/**
 * Listagem administrativa de marcas de veículo — URL como fonte da verdade.
 * Reordenação via drag-and-drop HTML5 (persistida imediatamente ao soltar).
 */
function AdminVehicleBrandsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseAdminVehicleBrandsFilters(searchParams);
  const apiParams = toAdminVehicleBrandsApiParams(filters);
  const brandsQuery = useAdminVehicleBrands(apiParams);

  const createMutation = useCreateAdminVehicleBrand();
  const updateMutation = useUpdateAdminVehicleBrand();
  const statusMutation = useUpdateAdminVehicleBrandStatus();
  const reorderMutation = useReorderAdminVehicleBrands();

  const [searchDraft, setSearchDraft] = useState(filters.q ?? "");
  const [lastSearchQ, setLastSearchQ] = useState(filters.q);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingBrand, setEditingBrand] =
    useState<AdminVehicleBrandListItemDto | null>(null);
  const [statusTarget, setStatusTarget] =
    useState<AdminVehicleBrandListItemDto | null>(null);

  const [items, setItems] = useState<AdminVehicleBrandListItemDto[]>([]);
  const [lastLoadedData, setLastLoadedData] = useState(brandsQuery.data);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  // Sincroniza estado local a partir da URL/dados carregados durante a
  // renderização (evita setState em efeito — ver react.dev/learn/you-might-not-need-an-effect).
  if (filters.q !== lastSearchQ) {
    setLastSearchQ(filters.q);
    setSearchDraft(filters.q ?? "");
  }

  if (brandsQuery.data && brandsQuery.data !== lastLoadedData) {
    setLastLoadedData(brandsQuery.data);
    setItems(brandsQuery.data.items);
  }

  const hasFilters = adminVehicleBrandsHasActiveFilters(filters);
  const sort = filters.sort ?? "order";
  const canReorder = sort === "order" && !hasFilters;

  const applyFilters = useCallback(
    (next: AdminVehicleBrandsUrlFilters) => {
      router.push(buildAdminVehicleBrandsHref(next));
    },
    [router],
  );

  const patchFilters = useCallback(
    (patch: Partial<AdminVehicleBrandsUrlFilters>) => {
      applyFilters({ ...filters, ...patch });
    },
    [applyFilters, filters],
  );

  const openCreateDialog = () => {
    setFormMode("create");
    setEditingBrand(null);
    setFormOpen(true);
  };

  const openEditDialog = (brand: AdminVehicleBrandListItemDto) => {
    setFormMode("edit");
    setEditingBrand(brand);
    setFormOpen(true);
  };

  const formDefaultValues: VehicleBrandFormValues | undefined = useMemo(
    () => (editingBrand ? mapAdminVehicleBrandToForm(editingBrand) : undefined),
    [editingBrand],
  );

  const submitError = createMutation.isError
    ? createMutation.error
    : updateMutation.isError
      ? updateMutation.error
      : undefined;

  const handleFormSubmit = (values: VehicleBrandFormValues) => {
    if (formMode === "create") {
      createMutation.mutate(mapVehicleBrandFormToCreateRequest(values), {
        onSuccess: () => setFormOpen(false),
      });
      return;
    }

    if (!editingBrand) return;
    updateMutation.mutate(
      { id: editingBrand.id, ...mapVehicleBrandFormToUpdateRequest(values) },
      { onSuccess: () => setFormOpen(false) },
    );
  };

  const handleDrop = (targetId: number) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const currentOrder = [...items];
    const fromIndex = currentOrder.findIndex((item) => item.id === draggedId);
    const toIndex = currentOrder.findIndex((item) => item.id === targetId);

    if (fromIndex === -1 || toIndex === -1) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const [moved] = currentOrder.splice(fromIndex, 1);
    currentOrder.splice(toIndex, 0, moved);

    setItems(currentOrder);
    setDraggedId(null);
    setDragOverId(null);

    reorderMutation.mutate(
      { orderedIds: currentOrder.map((item) => item.id) },
      {
        onError: () => {
          if (brandsQuery.data) {
            setItems(brandsQuery.data.items);
          }
        },
      },
    );
  };

  return (
    <AdminPage
      title="Marcas"
      description="Gerencie as marcas de veículo disponíveis para anúncios e filtros do marketplace."
      breadcrumb={[{ label: "Admin", href: ROUTES.ADMIN }, { label: "Marcas" }]}
      actions={
        <Button type="button" variant="primary" size="sm" onClick={openCreateDialog}>
          <Plus className="size-4" aria-hidden />
          Nova marca
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
              placeholder="Buscar marca…"
              aria-label="Buscar marcas"
              onClear={() => {
                setSearchDraft("");
                patchFilters({ q: undefined });
              }}
            />
          </form>
        }
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="admin-vehicle-brands-status">
              Status
            </label>
            <select
              id="admin-vehicle-brands-status"
              className={selectClassName}
              value={filters.status ?? "all"}
              onChange={(event) => {
                const value = event.target.value;
                patchFilters({
                  status:
                    value === "all"
                      ? undefined
                      : (value as AdminVehicleBrandsUrlFilters["status"]),
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
            <label className="sr-only" htmlFor="admin-vehicle-brands-sort">
              Ordenar por
            </label>
            <select
              id="admin-vehicle-brands-sort"
              className={selectClassName}
              value={sort}
              onChange={(event) => {
                const value = event.target.value as AdminVehicleBrandSortParam;
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
        description={
          canReorder
            ? "Arraste as linhas para reordenar — a nova ordem é salva automaticamente."
            : "Limpe a busca, os filtros e ordene por “Ordem” para reordenar por arrastar."
        }
      >
        {brandsQuery.isError ? (
          <AdminEmptyState
            title="Não foi possível carregar as marcas"
            description={getFriendlyErrorMessage(brandsQuery.error)}
            icon={<Car aria-hidden />}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void brandsQuery.refetch();
                }}
              >
                Tentar novamente
              </Button>
            }
          />
        ) : brandsQuery.isLoading ? (
          <AdminTableSkeleton columns={8} />
        ) : items.length === 0 ? (
          <AdminEmptyState
            title={
              hasFilters
                ? "Nenhum resultado para os filtros aplicados"
                : "Nenhuma marca cadastrada"
            }
            description={
              hasFilters
                ? "Ajuste a busca ou limpe os filtros para ver mais resultados."
                : "Crie a primeira marca para anúncios e filtros do marketplace."
            }
            icon={<Car aria-hidden />}
            action={
              hasFilters ? null : (
                <Button type="button" variant="primary" size="sm" onClick={openCreateDialog}>
                  <Plus className="size-4" aria-hidden />
                  Nova marca
                </Button>
              )
            }
          />
        ) : (
          <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <caption className="sr-only">Marcas de veículo do marketplace</caption>
                <thead className="bg-muted/40 border-border border-b">
                  <tr>
                    <th scope="col" className="w-10 px-2 py-3" aria-hidden />
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
                  {items.map((brand) => (
                    <tr
                      key={brand.id}
                      draggable={canReorder}
                      onDragStart={(event) => {
                        if (!canReorder) return;
                        setDraggedId(brand.id);
                        event.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(event) => {
                        if (!canReorder || !draggedId) return;
                        event.preventDefault();
                        setDragOverId(brand.id);
                      }}
                      onDragEnd={() => {
                        setDraggedId(null);
                        setDragOverId(null);
                      }}
                      onDrop={(event) => {
                        if (!canReorder) return;
                        event.preventDefault();
                        handleDrop(brand.id);
                      }}
                      className={cn(
                        "hover:bg-muted/30 transition-colors",
                        draggedId === brand.id && "opacity-50",
                        dragOverId === brand.id &&
                          draggedId &&
                          draggedId !== brand.id &&
                          "bg-primary/5 outline-primary/40 outline-2 -outline-offset-2",
                      )}
                    >
                      <td className="px-2 py-3 text-center">
                        {canReorder ? (
                          <GripVertical
                            className="text-muted-foreground mx-auto size-4 cursor-grab active:cursor-grabbing"
                            aria-hidden
                          />
                        ) : null}
                      </td>
                      <td className="text-foreground px-4 py-3 font-medium">
                        {brand.name}
                      </td>
                      <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                        {brand.slug}
                      </td>
                      <td className="text-foreground px-4 py-3 tabular-nums">
                        {brand.displayOrder}
                      </td>
                      <td className="text-foreground px-4 py-3 tabular-nums">
                        {formatMetricCount(brand.advertisementCount)}
                      </td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge status={brand.isActive ? "active" : "inactive"} />
                      </td>
                      <td className="text-foreground px-4 py-3">
                        {formatDate(brand.updatedAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(brand)}
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setStatusTarget(brand)}
                          >
                            {brand.isActive ? "Inativar" : "Ativar"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </AdminSection>

      <VehicleBrandFormDialog
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
        title={statusTarget?.isActive ? "Inativar marca?" : "Ativar marca?"}
        description={
          statusTarget?.isActive
            ? `A marca “${statusTarget.name}” deixará de aparecer nas listas públicas.`
            : `A marca “${statusTarget?.name ?? ""}” voltará a aparecer nas listas públicas.`
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

export { AdminVehicleBrandsView };
