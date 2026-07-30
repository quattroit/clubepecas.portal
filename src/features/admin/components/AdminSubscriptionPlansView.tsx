"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Pencil, Plus, Trash2 } from "lucide-react";

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
import type { AdminSubscriptionPlanListItemDto } from "@/contracts/admin/subscription-plans";
import { SubscriptionPlanFormDialog } from "@/features/admin/components/SubscriptionPlanFormDialog";
import type { SubscriptionPlanFormValues } from "@/features/admin/schemas/subscriptionPlanFormSchema";
import { useAdminSubscriptionPlan } from "@/hooks/api/useAdminSubscriptionPlan";
import { useAdminSubscriptionPlans } from "@/hooks/api/useAdminSubscriptionPlans";
import { useCreateAdminSubscriptionPlan } from "@/hooks/api/useCreateAdminSubscriptionPlan";
import { useDeleteAdminSubscriptionPlan } from "@/hooks/api/useDeleteAdminSubscriptionPlan";
import { useUpdateAdminSubscriptionPlan } from "@/hooks/api/useUpdateAdminSubscriptionPlan";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import {
  mapAdminSubscriptionPlanToForm,
  mapSubscriptionPlanFormToCreateRequest,
  mapSubscriptionPlanFormToUpdateRequest,
} from "@/mappers/subscription-plan-form.mapper";
import {
  adminSubscriptionPlansHasActiveFilters,
  buildAdminSubscriptionPlansHref,
  filterAdminSubscriptionPlans,
  parseAdminSubscriptionPlansFilters,
  type AdminSubscriptionPlansUrlFilters,
} from "@/utils/admin-subscription-plans-search";
import { formatCurrency } from "@/utils/formatCurrency";

/**
 * Listagem administrativa de planos de assinatura — URL como fonte da verdade
 * para a busca (filtro client-side). Sem drag-and-drop; ordem via formulário.
 */
function AdminSubscriptionPlansView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseAdminSubscriptionPlansFilters(searchParams);
  const plansQuery = useAdminSubscriptionPlans();

  const createMutation = useCreateAdminSubscriptionPlan();
  const updateMutation = useUpdateAdminSubscriptionPlan();
  const deleteMutation = useDeleteAdminSubscriptionPlan();

  const [searchDraft, setSearchDraft] = useState(filters.q ?? "");
  const [lastSearchQ, setLastSearchQ] = useState(filters.q);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingPlan, setEditingPlan] =
    useState<AdminSubscriptionPlanListItemDto | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<AdminSubscriptionPlanListItemDto | null>(null);

  if (filters.q !== lastSearchQ) {
    setLastSearchQ(filters.q);
    setSearchDraft(filters.q ?? "");
  }

  const items = filterAdminSubscriptionPlans(
    plansQuery.data?.items ?? [],
    filters,
  );

  const hasFilters = adminSubscriptionPlansHasActiveFilters(filters);

  const applyFilters = useCallback(
    (next: AdminSubscriptionPlansUrlFilters) => {
      router.push(buildAdminSubscriptionPlansHref(next));
    },
    [router],
  );

  const patchFilters = useCallback(
    (patch: Partial<AdminSubscriptionPlansUrlFilters>) => {
      applyFilters({ ...filters, ...patch });
    },
    [applyFilters, filters],
  );

  const openCreateDialog = () => {
    setFormMode("create");
    setEditingPlan(null);
    setFormOpen(true);
  };

  const openEditDialog = (plan: AdminSubscriptionPlanListItemDto) => {
    setFormMode("edit");
    setEditingPlan(plan);
    setFormOpen(true);
  };

  const planDetailQuery = useAdminSubscriptionPlan(
    formOpen && formMode === "edit" ? editingPlan?.id : undefined,
  );

  const formDefaultValues: SubscriptionPlanFormValues | undefined = useMemo(() => {
    if (formMode !== "edit") return undefined;
    // Preferir detalhe (displayName/description dos ciclos); listagem não traz esses campos.
    const source = planDetailQuery.data ?? editingPlan;
    return source ? mapAdminSubscriptionPlanToForm(source) : undefined;
  }, [editingPlan, formMode, planDetailQuery.data]);

  const submitError = createMutation.isError
    ? createMutation.error
    : updateMutation.isError
      ? updateMutation.error
      : planDetailQuery.isError
        ? planDetailQuery.error
        : undefined;

  const handleFormSubmit = (values: SubscriptionPlanFormValues) => {
    if (formMode === "create") {
      createMutation.mutate(mapSubscriptionPlanFormToCreateRequest(values), {
        onSuccess: () => setFormOpen(false),
      });
      return;
    }

    if (!editingPlan) return;
    updateMutation.mutate(
      {
        id: editingPlan.id,
        ...mapSubscriptionPlanFormToUpdateRequest(values),
      },
      { onSuccess: () => setFormOpen(false) },
    );
  };

  return (
    <AdminPage
      title="Planos"
      description="Gerencie os planos de assinatura disponíveis na plataforma."
      breadcrumb={[{ label: "Admin", href: ROUTES.ADMIN }, { label: "Planos" }]}
      actions={
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={openCreateDialog}
        >
          <Plus className="size-4" aria-hidden />
          Novo plano
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
              placeholder="Buscar plano…"
              aria-label="Buscar planos"
              onClear={() => {
                setSearchDraft("");
                patchFilters({ q: undefined });
              }}
            />
          </form>
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
        description="Ordene os planos pelo campo “Ordem de exibição” no formulário."
      >
        {plansQuery.isError ? (
          <AdminEmptyState
            title="Não foi possível carregar os planos"
            description={getFriendlyErrorMessage(plansQuery.error)}
            icon={<CreditCard aria-hidden />}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void plansQuery.refetch();
                }}
              >
                Tentar novamente
              </Button>
            }
          />
        ) : plansQuery.isLoading ? (
          <AdminTableSkeleton columns={6} />
        ) : items.length === 0 ? (
          <AdminEmptyState
            title={
              hasFilters
                ? "Nenhum resultado para os filtros aplicados"
                : "Nenhum plano cadastrado"
            }
            description={
              hasFilters
                ? "Ajuste a busca ou limpe os filtros para ver mais resultados."
                : "Crie o primeiro plano de assinatura da plataforma."
            }
            icon={<CreditCard aria-hidden />}
            action={
              hasFilters ? null : (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={openCreateDialog}
                >
                  <Plus className="size-4" aria-hidden />
                  Novo plano
                </Button>
              )
            }
          />
        ) : (
          <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <caption className="sr-only">Planos de assinatura</caption>
                <thead className="bg-muted/40 border-border border-b">
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
                      Preço
                    </th>
                    <th
                      scope="col"
                      className="text-muted-foreground px-4 py-3 text-xs font-semibold tracking-wide uppercase"
                    >
                      Limite de anúncios
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
                      Status
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
                  {items.map((plan) => (
                    <tr
                      key={plan.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="text-foreground px-4 py-3 font-medium">
                        <div className="flex flex-wrap items-center gap-2">
                          <span>{plan.name}</span>
                          {plan.isDemo ? (
                            <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                              Demo
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="text-foreground px-4 py-3 tabular-nums">
                        A partir de {formatCurrency(plan.startingPrice)}
                      </td>
                      <td className="text-foreground px-4 py-3 tabular-nums">
                        {plan.advertisementLimit}
                      </td>
                      <td className="text-foreground px-4 py-3 tabular-nums">
                        {plan.displayOrder}
                      </td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge
                          status={plan.isActive ? "active" : "inactive"}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(plan)}
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteTarget(plan)}
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                            Excluir
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

      <SubscriptionPlanFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        defaultValues={formDefaultValues}
        isSubmitting={
          createMutation.isPending ||
          updateMutation.isPending ||
          (formMode === "edit" && planDetailQuery.isFetching)
        }
        submitError={submitError}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Excluir plano?"
        description={
          deleteTarget
            ? `O plano “${deleteTarget.name}” será removido permanentemente. Esta ação não pode ser desfeita.`
            : ""
        }
        confirmLabel="Excluir"
        confirmVariant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
      />
    </AdminPage>
  );
}

export { AdminSubscriptionPlansView };
