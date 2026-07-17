"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FolderTree, GripVertical, Pencil, Plus } from "lucide-react";

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
  AdminCategoryListItemDto,
  AdminCategorySortParam,
} from "@/contracts/admin/categories";
import { CategoryFormDialog } from "@/features/admin/components/CategoryFormDialog";
import { CategoryIcon } from "@/features/marketplace/components/CategoryIcon";
import type { CategoryFormValues } from "@/features/admin/schemas/categoryFormSchema";
import { useAdminCategories } from "@/hooks/api/useAdminCategories";
import { useCreateAdminCategory } from "@/hooks/api/useCreateAdminCategory";
import { useReorderAdminCategories } from "@/hooks/api/useReorderAdminCategories";
import { useUpdateAdminCategory } from "@/hooks/api/useUpdateAdminCategory";
import { useUpdateAdminCategoryStatus } from "@/hooks/api/useUpdateAdminCategoryStatus";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import {
  mapAdminCategoryToForm,
  mapCategoryFormToCreateRequest,
  mapCategoryFormToUpdateRequest,
} from "@/mappers/category-form.mapper";
import { formatDate } from "@/utils/formatDate";
import { formatMetricCount } from "@/utils/formatMetrics";
import {
  adminCategoriesHasActiveFilters,
  buildAdminCategoriesHref,
  parseAdminCategoriesFilters,
  toAdminCategoriesApiParams,
  type AdminCategoriesUrlFilters,
} from "@/utils/admin-categories-search";

const SORT_OPTIONS: { value: AdminCategorySortParam; label: string }[] = [
  { value: "order", label: "Ordem" },
  { value: "name", label: "Nome" },
  { value: "advertisementCount", label: "Anúncios" },
];

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

/**
 * Listagem administrativa de categorias — URL como fonte da verdade.
 * Reordenação via drag-and-drop HTML5 (persistida imediatamente ao soltar).
 */
function AdminCategoriesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseAdminCategoriesFilters(searchParams);
  const apiParams = toAdminCategoriesApiParams(filters);
  const categoriesQuery = useAdminCategories(apiParams);

  const createMutation = useCreateAdminCategory();
  const updateMutation = useUpdateAdminCategory();
  const statusMutation = useUpdateAdminCategoryStatus();
  const reorderMutation = useReorderAdminCategories();

  const [searchDraft, setSearchDraft] = useState(filters.q ?? "");
  const [lastSearchQ, setLastSearchQ] = useState(filters.q);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingCategory, setEditingCategory] =
    useState<AdminCategoryListItemDto | null>(null);
  const [statusTarget, setStatusTarget] =
    useState<AdminCategoryListItemDto | null>(null);

  const [items, setItems] = useState<AdminCategoryListItemDto[]>([]);
  const [lastLoadedData, setLastLoadedData] = useState(categoriesQuery.data);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Sincroniza estado local a partir da URL/dados carregados durante a
  // renderização (evita setState em efeito — ver react.dev/learn/you-might-not-need-an-effect).
  if (filters.q !== lastSearchQ) {
    setLastSearchQ(filters.q);
    setSearchDraft(filters.q ?? "");
  }

  if (categoriesQuery.data && categoriesQuery.data !== lastLoadedData) {
    setLastLoadedData(categoriesQuery.data);
    setItems(categoriesQuery.data.items);
  }

  const hasFilters = adminCategoriesHasActiveFilters(filters);
  const sort = filters.sort ?? "order";
  const canReorder = sort === "order" && !hasFilters;

  const applyFilters = useCallback(
    (next: AdminCategoriesUrlFilters) => {
      router.push(buildAdminCategoriesHref(next));
    },
    [router],
  );

  const patchFilters = useCallback(
    (patch: Partial<AdminCategoriesUrlFilters>) => {
      applyFilters({ ...filters, ...patch });
    },
    [applyFilters, filters],
  );

  const openCreateDialog = () => {
    setFormMode("create");
    setEditingCategory(null);
    setFormOpen(true);
  };

  const openEditDialog = (category: AdminCategoryListItemDto) => {
    setFormMode("edit");
    setEditingCategory(category);
    setFormOpen(true);
  };

  const formDefaultValues: CategoryFormValues | undefined = useMemo(
    () => (editingCategory ? mapAdminCategoryToForm(editingCategory) : undefined),
    [editingCategory],
  );

  const submitError = createMutation.isError
    ? createMutation.error
    : updateMutation.isError
      ? updateMutation.error
      : undefined;

  const handleFormSubmit = (values: CategoryFormValues) => {
    if (formMode === "create") {
      createMutation.mutate(mapCategoryFormToCreateRequest(values), {
        onSuccess: () => setFormOpen(false),
      });
      return;
    }

    if (!editingCategory) return;
    updateMutation.mutate(
      { id: editingCategory.id, ...mapCategoryFormToUpdateRequest(values) },
      { onSuccess: () => setFormOpen(false) },
    );
  };

  const handleDrop = (targetId: string) => {
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
          if (categoriesQuery.data) {
            setItems(categoriesQuery.data.items);
          }
        },
      },
    );
  };

  return (
    <AdminPage
      title="Categorias"
      description="Gerencie as categorias do catálogo público do marketplace."
      breadcrumb={[{ label: "Admin", href: ROUTES.ADMIN }, { label: "Categorias" }]}
      actions={
        <Button type="button" variant="primary" size="sm" onClick={openCreateDialog}>
          <Plus className="size-4" aria-hidden />
          Nova categoria
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
              placeholder="Buscar categoria…"
              aria-label="Buscar categorias"
              onClear={() => {
                setSearchDraft("");
                patchFilters({ q: undefined });
              }}
            />
          </form>
        }
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="admin-categories-status">
              Status
            </label>
            <select
              id="admin-categories-status"
              className={selectClassName}
              value={filters.status ?? "all"}
              onChange={(event) => {
                const value = event.target.value;
                patchFilters({
                  status:
                    value === "all"
                      ? undefined
                      : (value as AdminCategoriesUrlFilters["status"]),
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
            <label className="sr-only" htmlFor="admin-categories-sort">
              Ordenar por
            </label>
            <select
              id="admin-categories-sort"
              className={selectClassName}
              value={sort}
              onChange={(event) => {
                const value = event.target.value as AdminCategorySortParam;
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
        {categoriesQuery.isError ? (
          <AdminEmptyState
            title="Não foi possível carregar as categorias"
            description={getFriendlyErrorMessage(categoriesQuery.error)}
            icon={<FolderTree aria-hidden />}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void categoriesQuery.refetch();
                }}
              >
                Tentar novamente
              </Button>
            }
          />
        ) : categoriesQuery.isLoading ? (
          <AdminTableSkeleton columns={7} />
        ) : items.length === 0 ? (
          <AdminEmptyState
            title={hasFilters ? "Nenhum resultado para os filtros aplicados" : "Nenhuma categoria cadastrada"}
            description={
              hasFilters
                ? "Ajuste a busca ou limpe os filtros para ver mais resultados."
                : "Crie a primeira categoria do catálogo do marketplace."
            }
            icon={<FolderTree aria-hidden />}
            action={
              hasFilters ? null : (
                <Button type="button" variant="primary" size="sm" onClick={openCreateDialog}>
                  <Plus className="size-4" aria-hidden />
                  Nova categoria
                </Button>
              )
            }
          />
        ) : (
          <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <caption className="sr-only">Categorias do marketplace</caption>
                <thead className="bg-muted/40 border-border border-b">
                  <tr>
                    <th scope="col" className="w-10 px-2 py-3" aria-hidden />
                    <th
                      scope="col"
                      className="text-muted-foreground px-4 py-3 text-xs font-semibold tracking-wide uppercase"
                    >
                      Ícone
                    </th>
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
                  {items.map((category) => (
                    <tr
                      key={category.id}
                      draggable={canReorder}
                      onDragStart={(event) => {
                        if (!canReorder) return;
                        setDraggedId(category.id);
                        event.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(event) => {
                        if (!canReorder || !draggedId) return;
                        event.preventDefault();
                        setDragOverId(category.id);
                      }}
                      onDragEnd={() => {
                        setDraggedId(null);
                        setDragOverId(null);
                      }}
                      onDrop={(event) => {
                        if (!canReorder) return;
                        event.preventDefault();
                        handleDrop(category.id);
                      }}
                      className={cn(
                        "hover:bg-muted/30 transition-colors",
                        draggedId === category.id && "opacity-50",
                        dragOverId === category.id &&
                          draggedId &&
                          draggedId !== category.id &&
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
                      <td className="px-4 py-3">
                        <span
                          className="border-border bg-muted/40 flex size-9 items-center justify-center rounded-lg border"
                          aria-hidden
                        >
                          <CategoryIcon
                            iconName={category.iconValue}
                            iconClassName="size-4"
                          />
                        </span>
                      </td>
                      <td className="text-foreground px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">{category.name}</span>
                          {category.description ? (
                            <span className="text-muted-foreground line-clamp-1 text-xs">
                              {category.description}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                        {category.slug}
                      </td>
                      <td className="text-foreground px-4 py-3 tabular-nums">
                        {category.displayOrder}
                      </td>
                      <td className="text-foreground px-4 py-3 tabular-nums">
                        {formatMetricCount(category.advertisementCount)}
                      </td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge status={category.isActive ? "active" : "inactive"} />
                      </td>
                      <td className="text-foreground px-4 py-3">
                        {formatDate(category.updatedAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(category)}
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setStatusTarget(category)}
                          >
                            {category.isActive ? "Inativar" : "Ativar"}
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

      <CategoryFormDialog
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
        title={statusTarget?.isActive ? "Inativar categoria?" : "Ativar categoria?"}
        description={
          statusTarget?.isActive
            ? `A categoria “${statusTarget.name}” deixará de aparecer no marketplace público.`
            : `A categoria “${statusTarget?.name ?? ""}” voltará a aparecer no marketplace público.`
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

export { AdminCategoriesView };
