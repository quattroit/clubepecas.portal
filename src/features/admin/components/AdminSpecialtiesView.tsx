"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, Plus, Tags } from "lucide-react";

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
  AdminSpecialtyListItemDto,
  AdminSpecialtySortParam,
} from "@/contracts/admin/specialties";
import { SpecialtyFormDialog } from "@/features/admin/components/SpecialtyFormDialog";
import type { SpecialtyFormValues } from "@/features/admin/schemas/specialtyFormSchema";
import { useAdminSpecialties } from "@/hooks/api/useAdminSpecialties";
import { useCreateAdminSpecialty } from "@/hooks/api/useCreateAdminSpecialty";
import { useUpdateAdminSpecialty } from "@/hooks/api/useUpdateAdminSpecialty";
import { useUpdateAdminSpecialtyStatus } from "@/hooks/api/useUpdateAdminSpecialtyStatus";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import {
  mapAdminSpecialtyToForm,
  mapSpecialtyFormToCreateRequest,
  mapSpecialtyFormToUpdateRequest,
} from "@/mappers/specialty-form.mapper";
import { formatDate } from "@/utils/formatDate";
import { formatMetricCount } from "@/utils/formatMetrics";
import {
  adminSpecialtiesHasActiveFilters,
  buildAdminSpecialtiesHref,
  parseAdminSpecialtiesFilters,
  toAdminSpecialtiesApiParams,
  type AdminSpecialtiesUrlFilters,
} from "@/utils/admin-specialties-search";

const SORT_OPTIONS: { value: AdminSpecialtySortParam; label: string }[] = [
  { value: "order", label: "Ordem" },
  { value: "name", label: "Nome" },
  { value: "sellerCount", label: "Vendedores" },
];

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

function AdminSpecialtiesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseAdminSpecialtiesFilters(searchParams);
  const apiParams = toAdminSpecialtiesApiParams(filters);
  const specialtiesQuery = useAdminSpecialties(apiParams);

  const createMutation = useCreateAdminSpecialty();
  const updateMutation = useUpdateAdminSpecialty();
  const statusMutation = useUpdateAdminSpecialtyStatus();

  const [searchDraft, setSearchDraft] = useState(filters.q ?? "");
  const [lastSearchQ, setLastSearchQ] = useState(filters.q);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingSpecialty, setEditingSpecialty] =
    useState<AdminSpecialtyListItemDto | null>(null);
  const [statusTarget, setStatusTarget] =
    useState<AdminSpecialtyListItemDto | null>(null);

  if (filters.q !== lastSearchQ) {
    setLastSearchQ(filters.q);
    setSearchDraft(filters.q ?? "");
  }

  const hasFilters = adminSpecialtiesHasActiveFilters(filters);
  const items = specialtiesQuery.data?.items ?? [];

  const applyFilters = useCallback(
    (next: AdminSpecialtiesUrlFilters) => {
      router.push(buildAdminSpecialtiesHref(next));
    },
    [router],
  );

  const patchFilters = useCallback(
    (patch: Partial<AdminSpecialtiesUrlFilters>) => {
      applyFilters({ ...filters, ...patch });
    },
    [applyFilters, filters],
  );

  const openCreateDialog = () => {
    setFormMode("create");
    setEditingSpecialty(null);
    setFormOpen(true);
  };

  const openEditDialog = (specialty: AdminSpecialtyListItemDto) => {
    setFormMode("edit");
    setEditingSpecialty(specialty);
    setFormOpen(true);
  };

  const formDefaultValues: SpecialtyFormValues | undefined = useMemo(
    () =>
      editingSpecialty ? mapAdminSpecialtyToForm(editingSpecialty) : undefined,
    [editingSpecialty],
  );

  const submitError = createMutation.isError
    ? createMutation.error
    : updateMutation.isError
      ? updateMutation.error
      : undefined;

  const handleFormSubmit = (values: SpecialtyFormValues) => {
    if (formMode === "create") {
      createMutation.mutate(mapSpecialtyFormToCreateRequest(values), {
        onSuccess: () => setFormOpen(false),
      });
      return;
    }

    if (!editingSpecialty) return;
    updateMutation.mutate(
      {
        id: editingSpecialty.id,
        ...mapSpecialtyFormToUpdateRequest(values),
      },
      { onSuccess: () => setFormOpen(false) },
    );
  };

  return (
    <AdminPage
      title="Especialidades"
      description="Gerencie as especialidades que os vendedores podem selecionar no perfil (até 3)."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Especialidades" },
      ]}
      actions={
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={openCreateDialog}
        >
          <Plus className="size-4" aria-hidden />
          Nova especialidade
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
              placeholder="Buscar especialidade…"
              aria-label="Buscar especialidades"
              onClear={() => {
                setSearchDraft("");
                patchFilters({ q: undefined });
              }}
            />
          </form>
        }
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="admin-specialties-status">
              Status
            </label>
            <select
              id="admin-specialties-status"
              className={selectClassName}
              value={filters.status ?? "all"}
              onChange={(event) => {
                const value = event.target.value;
                patchFilters({
                  status:
                    value === "all"
                      ? undefined
                      : (value as AdminSpecialtiesUrlFilters["status"]),
                });
              }}
            >
              <option value="all">Status: todos</option>
              <option value="active">Ativa</option>
              <option value="inactive">Inativa</option>
            </select>

            <label className="sr-only" htmlFor="admin-specialties-sort">
              Ordenar
            </label>
            <select
              id="admin-specialties-sort"
              className={selectClassName}
              value={filters.sort ?? "order"}
              onChange={(event) => {
                patchFilters({
                  sort: event.target.value as AdminSpecialtySortParam,
                });
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
      />

      <AdminSection title="Listagem">
        {specialtiesQuery.isLoading ? (
          <AdminTableSkeleton columns={6} rows={8} />
        ) : specialtiesQuery.isError ? (
          <AdminEmptyState
            icon={<Tags aria-hidden />}
            title="Não foi possível carregar as especialidades"
            description={getFriendlyErrorMessage(specialtiesQuery.error)}
          />
        ) : items.length === 0 ? (
          <AdminEmptyState
            icon={<Tags aria-hidden />}
            title={
              hasFilters
                ? "Nenhuma especialidade encontrada"
                : "Nenhuma especialidade cadastrada"
            }
            description={
              hasFilters
                ? "Ajuste os filtros ou limpe a busca."
                : "Crie a primeira especialidade para os vendedores."
            }
            action={
              hasFilters ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyFilters({})}
                >
                  Limpar filtros
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={openCreateDialog}
                >
                  <Plus className="size-4" aria-hidden />
                  Nova especialidade
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-border text-muted-foreground border-b text-xs uppercase">
                  <th className="px-3 py-2 font-medium">Ordem</th>
                  <th className="px-3 py-2 font-medium">Nome</th>
                  <th className="px-3 py-2 font-medium">Slug</th>
                  <th className="px-3 py-2 font-medium">Vendedores</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Atualizado</th>
                  <th className="px-3 py-2 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((specialty) => (
                  <tr
                    key={specialty.id}
                    className="border-border/70 border-b last:border-0"
                  >
                    <td className="px-3 py-2.5 tabular-nums">
                      {specialty.displayOrder}
                    </td>
                    <td className="px-3 py-2.5 font-medium">{specialty.name}</td>
                    <td className="text-muted-foreground px-3 py-2.5">
                      {specialty.slug}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {formatMetricCount(specialty.sellerCount)}
                    </td>
                    <td className="px-3 py-2.5">
                      <AdminStatusBadge
                        status={specialty.isActive ? "active" : "inactive"}
                        label={specialty.isActive ? "Ativa" : "Inativa"}
                      />
                    </td>
                    <td className="text-muted-foreground px-3 py-2.5">
                      {specialty.updatedAt
                        ? formatDate(specialty.updatedAt)
                        : formatDate(specialty.createdAt)}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(specialty)}
                        >
                          <Pencil className="size-3.5" aria-hidden />
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setStatusTarget(specialty)}
                        >
                          {specialty.isActive ? "Inativar" : "Ativar"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminSection>

      <SpecialtyFormDialog
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
        title={
          statusTarget?.isActive
            ? "Inativar especialidade?"
            : "Ativar especialidade?"
        }
        description={
          statusTarget?.isActive
            ? `A especialidade “${statusTarget.name}” deixará de aparecer para novos vínculos no perfil do vendedor.`
            : `A especialidade “${statusTarget?.name ?? ""}” voltará a ficar disponível no perfil do vendedor.`
        }
        confirmLabel={statusTarget?.isActive ? "Inativar" : "Ativar"}
        confirmVariant={statusTarget?.isActive ? "destructive" : "primary"}
        loading={statusMutation.isPending}
        onConfirm={() => {
          if (!statusTarget) return;
          statusMutation.mutate(
            {
              id: statusTarget.id,
              payload: { isActive: !statusTarget.isActive },
            },
            { onSuccess: () => setStatusTarget(null) },
          );
        }}
      />
    </AdminPage>
  );
}

export { AdminSpecialtiesView };
