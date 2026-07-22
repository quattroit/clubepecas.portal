"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Copy, Eye, Pencil, Plus, UserRound } from "lucide-react";
import { toast } from "sonner";

import {
  AdminEmptyState,
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminStatusBadge,
  AdminTable,
  ConfirmDialog,
} from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin";
import { Pagination } from "@/components/navigation/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import type {
  AdminRepresentativeDetailDto,
  AdminRepresentativeListItemDto,
  AdminRepresentativeSortParam,
} from "@/contracts/admin/representatives";
import {
  isRepresentativeActive,
} from "@/contracts/admin/representatives";
import { RepresentativeDetailDialog } from "@/features/admin/components/RepresentativeDetailDialog";
import { RepresentativeFormDialog } from "@/features/admin/components/RepresentativeFormDialog";
import type { RepresentativeFormValues } from "@/features/admin/schemas/representativeFormSchema";
import { useActivateAdminRepresentative } from "@/hooks/api/useActivateAdminRepresentative";
import { useAdminRepresentative } from "@/hooks/api/useAdminRepresentative";
import { useAdminRepresentatives } from "@/hooks/api/useAdminRepresentatives";
import { useCreateAdminRepresentative } from "@/hooks/api/useCreateAdminRepresentative";
import { useDeactivateAdminRepresentative } from "@/hooks/api/useDeactivateAdminRepresentative";
import { useUpdateAdminRepresentative } from "@/hooks/api/useUpdateAdminRepresentative";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";
import { formatDocumentInput, onlyDigits } from "@/utils/document";
import { PersonType } from "@/contracts/common/enums";
import { formatPostalCodeInput, normalizePostalCode } from "@/utils/postalCode";
import {
  adminRepresentativesHasActiveFilters,
  buildAdminRepresentativesHref,
  parseAdminRepresentativesFilters,
  toAdminRepresentativesApiParams,
  type AdminRepresentativesUrlFilters,
} from "@/utils/admin-representatives-search";

const SORT_OPTIONS: { value: AdminRepresentativeSortParam; label: string }[] =
  [
    { value: "createdAt", label: "Cadastro" },
    { value: "name", label: "Nome" },
    { value: "email", label: "E-mail" },
    { value: "code", label: "Código" },
    { value: "status", label: "Status" },
  ];

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

async function copyCode(code: string) {
  try {
    await navigator.clipboard.writeText(code);
    toast.success("Código copiado.");
  } catch {
    toast.error("Não foi possível copiar o código.");
  }
}

function mapDetailToForm(
  detail: AdminRepresentativeDetailDto,
): RepresentativeFormValues {
  return {
    name: detail.name,
    email: detail.email,
    phone: detail.phone,
    document: formatDocumentInput(detail.document, PersonType.Individual),
    zipCode: formatPostalCodeInput(detail.zipCode),
    addressStreet: detail.addressStreet,
    addressNumber: detail.addressNumber,
    addressComplement: detail.addressComplement ?? "",
    neighborhood: detail.neighborhood,
    city: detail.city,
    state: detail.state,
    status: isRepresentativeActive(detail.status) ? "active" : "inactive",
  };
}

function AdminRepresentativesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseAdminRepresentativesFilters(searchParams);
  const apiParams = toAdminRepresentativesApiParams(filters);
  const listQuery = useAdminRepresentatives(apiParams);

  const createMutation = useCreateAdminRepresentative();
  const updateMutation = useUpdateAdminRepresentative();
  const activateMutation = useActivateAdminRepresentative();
  const deactivateMutation = useDeactivateAdminRepresentative();

  const [nameDraft, setNameDraft] = useState(filters.name ?? "");
  const [emailDraft, setEmailDraft] = useState(filters.email ?? "");
  const [codeDraft, setCodeDraft] = useState(filters.code ?? "");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);
  const [statusTarget, setStatusTarget] =
    useState<AdminRepresentativeListItemDto | null>(null);

  const editQuery = useAdminRepresentative(editingId ?? 0, formOpen && formMode === "edit" && editingId != null);
  const viewQuery = useAdminRepresentative(viewId ?? 0, viewId != null);

  useEffect(() => {
    setNameDraft(filters.name ?? "");
    setEmailDraft(filters.email ?? "");
    setCodeDraft(filters.code ?? "");
  }, [filters.name, filters.email, filters.code]);

  const applyFilters = useCallback(
    (next: AdminRepresentativesUrlFilters) => {
      router.push(buildAdminRepresentativesHref(next));
    },
    [router],
  );

  const patchFilters = useCallback(
    (patch: Partial<AdminRepresentativesUrlFilters>) => {
      applyFilters({
        ...filters,
        ...patch,
        page: patch.page ?? 1,
      });
    },
    [applyFilters, filters],
  );

  const hasFilters = adminRepresentativesHasActiveFilters(filters);
  const items = listQuery.data?.items ?? [];
  const totalItems = listQuery.data?.totalItems ?? 0;
  const currentPage = listQuery.data?.currentPage ?? filters.page ?? 1;
  const totalPages = Math.max(1, listQuery.data?.totalPages ?? 1);

  const formDefaultValues = useMemo(() => {
    if (formMode === "edit" && editQuery.data) {
      return mapDetailToForm(editQuery.data);
    }
    return undefined;
  }, [formMode, editQuery.data]);

  const submitError = createMutation.isError
    ? createMutation.error
    : updateMutation.isError
      ? updateMutation.error
      : undefined;

  const openCreate = () => {
    setFormMode("create");
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (row: AdminRepresentativeListItemDto) => {
    setFormMode("edit");
    setEditingId(row.id);
    setFormOpen(true);
  };

  const handleFormSubmit = (values: RepresentativeFormValues) => {
    const status = values.status === "active" ? 1 : 2;
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: onlyDigits(values.phone),
      zipCode: normalizePostalCode(values.zipCode),
      addressStreet: values.addressStreet.trim(),
      addressNumber: values.addressNumber.trim(),
      addressComplement: values.addressComplement.trim() || null,
      neighborhood: values.neighborhood.trim(),
      city: values.city.trim(),
      state: values.state.trim().toUpperCase(),
      status,
    };

    if (formMode === "create") {
      createMutation.mutate(
        {
          ...payload,
          document: onlyDigits(values.document),
        },
        { onSuccess: () => setFormOpen(false) },
      );
      return;
    }

    if (!editingId) return;
    updateMutation.mutate(
      { id: editingId, ...payload },
      { onSuccess: () => setFormOpen(false) },
    );
  };

  const columns: AdminTableColumn<AdminRepresentativeListItemDto>[] = [
    {
      id: "code",
      header: "Código",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-sm font-medium">
            {row.representativeCode}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7"
            aria-label="Copiar código"
            onClick={() => void copyCode(row.representativeCode)}
          >
            <Copy className="size-3.5" />
          </Button>
        </div>
      ),
    },
    {
      id: "name",
      header: "Nome",
      accessor: (row) => row.name,
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
      id: "phone",
      header: "Telefone",
      accessor: (row) => row.phone,
    },
    {
      id: "location",
      header: "Cidade / UF",
      accessor: (row) => `${row.city} / ${row.state}`,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <AdminStatusBadge
          status={isRepresentativeActive(row.status) ? "active" : "inactive"}
        />
      ),
    },
    {
      id: "createdAt",
      header: "Cadastro",
      accessor: (row) => formatDate(row.createdAt),
    },
    {
      id: "actions",
      header: "Ações",
      cell: (row) => {
        const active = isRepresentativeActive(row.status);
        return (
          <div className="flex flex-wrap items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setViewId(row.id)}
            >
              <Eye className="size-3.5" />
              Visualizar
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => openEdit(row)}
            >
              <Pencil className="size-3.5" />
              Editar
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStatusTarget(row)}
            >
              {active ? "Inativar" : "Ativar"}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <AdminPage
      title="Representantes"
      description="Cadastre e gerencie representantes comerciais da plataforma."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Representantes" },
      ]}
      actions={
        <Button type="button" variant="primary" size="sm" onClick={openCreate}>
          <Plus className="size-4" />
          Novo representante
        </Button>
      }
    >
      <AdminFilterBar
        filters={
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex min-w-[10rem] flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                Nome
              </label>
              <Input
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    patchFilters({ name: nameDraft.trim() || undefined });
                  }
                }}
                placeholder="Buscar por nome"
                className="h-10"
              />
            </div>
            <div className="flex min-w-[10rem] flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                E-mail
              </label>
              <Input
                value={emailDraft}
                onChange={(event) => setEmailDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    patchFilters({ email: emailDraft.trim() || undefined });
                  }
                }}
                placeholder="Buscar por e-mail"
                className="h-10"
              />
            </div>
            <div className="flex min-w-[8rem] flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                Código
              </label>
              <Input
                value={codeDraft}
                onChange={(event) =>
                  setCodeDraft(event.target.value.toUpperCase())
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    patchFilters({ code: codeDraft.trim() || undefined });
                  }
                }}
                placeholder="REP000001"
                className="h-10 font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                Status
              </label>
              <select
                className={selectClassName}
                value={filters.status ?? "all"}
                onChange={(event) =>
                  patchFilters({
                    status:
                      event.target.value === "all"
                        ? undefined
                        : (event.target.value as "active" | "inactive"),
                  })
                }
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10"
              onClick={() =>
                patchFilters({
                  name: nameDraft.trim() || undefined,
                  email: emailDraft.trim() || undefined,
                  code: codeDraft.trim() || undefined,
                })
              }
            >
              Filtrar
            </Button>
            {hasFilters ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-10"
                onClick={() =>
                  applyFilters({
                    sort: filters.sort,
                    sortDir: filters.sortDir,
                  })
                }
              >
                Limpar
              </Button>
            ) : null}
          </div>
        }
        sort={
          <div className="flex flex-wrap items-center gap-2">
            <select
              className={selectClassName}
              aria-label="Ordenar por"
              value={filters.sort ?? "createdAt"}
              onChange={(event) =>
                patchFilters({
                  sort: event.target.value as AdminRepresentativeSortParam,
                })
              }
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
              value={filters.sortDir ?? "desc"}
              onChange={(event) =>
                patchFilters({
                  sortDir: event.target.value as "asc" | "desc",
                })
              }
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        }
      />

      <AdminSection
        title="Listagem"
        description={
          listQuery.isSuccess
            ? `${totalItems} representante${totalItems === 1 ? "" : "s"}`
            : "Resultados da busca e filtros aplicados."
        }
      >
        {listQuery.isError ? (
          <AdminEmptyState
            title="Não foi possível carregar os representantes"
            description={getFriendlyErrorMessage(listQuery.error)}
            icon={<UserRound aria-hidden />}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void listQuery.refetch();
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
            loading={listQuery.isLoading}
            caption="Representantes comerciais"
            emptyTitle={
              hasFilters
                ? "Nenhum resultado para os filtros aplicados"
                : "Nenhum representante encontrado"
            }
            emptyDescription={
              hasFilters
                ? "Ajuste os filtros ou limpe a busca."
                : "Cadastre o primeiro representante comercial."
            }
            emptyAction={
              !hasFilters ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={openCreate}
                >
                  Novo representante
                </Button>
              ) : undefined
            }
            pagination={
              totalPages > 1 ? (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => patchFilters({ page })}
                />
              ) : null
            }
          />
        )}
      </AdminSection>

      <RepresentativeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        representativeCode={
          formMode === "edit" ? editQuery.data?.representativeCode : null
        }
        defaultValues={formDefaultValues}
        isSubmitting={
          createMutation.isPending ||
          updateMutation.isPending ||
          (formMode === "edit" && editQuery.isLoading)
        }
        submitError={submitError}
        onSubmit={handleFormSubmit}
      />

      <RepresentativeDetailDialog
        open={viewId != null}
        onOpenChange={(open) => {
          if (!open) setViewId(null);
        }}
        data={viewQuery.data}
        isLoading={viewQuery.isLoading}
        error={viewQuery.error}
      />

      <ConfirmDialog
        open={statusTarget != null}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
        title={
          statusTarget && isRepresentativeActive(statusTarget.status)
            ? "Inativar representante?"
            : "Ativar representante?"
        }
        description={
          statusTarget
            ? isRepresentativeActive(statusTarget.status)
              ? `${statusTarget.name} (${statusTarget.representativeCode}) ficará inativo. Exclusão física não é permitida.`
              : `${statusTarget.name} (${statusTarget.representativeCode}) voltará a ficar ativo.`
            : ""
        }
        confirmLabel={
          statusTarget && isRepresentativeActive(statusTarget.status)
            ? "Inativar"
            : "Ativar"
        }
        confirmVariant={
          statusTarget && isRepresentativeActive(statusTarget.status)
            ? "destructive"
            : "primary"
        }
        loading={activateMutation.isPending || deactivateMutation.isPending}
        onConfirm={() => {
          if (!statusTarget) return;
          const id = statusTarget.id;
          const active = isRepresentativeActive(statusTarget.status);
          const mutation = active ? deactivateMutation : activateMutation;
          mutation.mutate(id, {
            onSuccess: () => setStatusTarget(null),
          });
        }}
      />
    </AdminPage>
  );
}

export { AdminRepresentativesView };
