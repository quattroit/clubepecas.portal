"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BriefcaseBusiness, Eye, Plus, Trash2 } from "lucide-react";

import {
  AdminEmptyState,
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminStatusBadge,
  AdminTable,
  ConfirmDialog,
} from "@/components/admin";
import type { AdminStatusVariant, AdminTableColumn } from "@/components/admin";
import { Pagination } from "@/components/navigation/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { ProfessionalBuyerStatus } from "@/contracts/common/enums";
import type {
  ProfessionalBuyerDto,
  ProfessionalBuyerSortParam,
} from "@/contracts/professional-buyers";
import {
  isProfessionalBuyerActive,
  isProfessionalBuyerPending,
  isProfessionalBuyerSuspended,
} from "@/contracts/professional-buyers";
import { ProfessionalBuyerDetailDialog } from "@/features/admin/components/ProfessionalBuyerDetailDialog";
import { ProfessionalBuyerFormDialog } from "@/features/admin/components/ProfessionalBuyerFormDialog";
import type { ProfessionalBuyerFormValues } from "@/features/admin/schemas/professionalBuyerFormSchema";
import { useActivateAdminProfessionalBuyer } from "@/hooks/api/useActivateAdminProfessionalBuyer";
import { useAdminProfessionalBuyer } from "@/hooks/api/useAdminProfessionalBuyer";
import { useAdminProfessionalBuyers } from "@/hooks/api/useAdminProfessionalBuyers";
import { useCreateAdminProfessionalBuyer } from "@/hooks/api/useCreateAdminProfessionalBuyer";
import { useDeleteAdminProfessionalBuyer } from "@/hooks/api/useDeleteAdminProfessionalBuyer";
import { useSuspendAdminProfessionalBuyer } from "@/hooks/api/useSuspendAdminProfessionalBuyer";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";
import { formatDocumentAuto, onlyDigits } from "@/utils/document";
import { normalizePostalCode } from "@/utils/postalCode";
import {
  adminProfessionalBuyersHasActiveFilters,
  buildAdminProfessionalBuyersHref,
  parseAdminProfessionalBuyersFilters,
  toAdminProfessionalBuyersApiParams,
  type AdminProfessionalBuyersUrlFilters,
} from "@/utils/admin-professional-buyers-search";

const SORT_OPTIONS: { value: ProfessionalBuyerSortParam; label: string }[] = [
  { value: "createdAt", label: "Cadastro" },
  { value: "companyName", label: "Nome fantasia" },
  { value: "corporateName", label: "Razão social" },
  { value: "contactName", label: "Contato" },
  { value: "email", label: "E-mail" },
  { value: "status", label: "Status" },
];

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

function statusVariant(status: ProfessionalBuyerStatus): AdminStatusVariant {
  if (isProfessionalBuyerActive(status)) return "active";
  if (isProfessionalBuyerPending(status)) return "pending";
  if (isProfessionalBuyerSuspended(status)) return "blocked";
  return "default";
}

function AdminProfessionalBuyersView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseAdminProfessionalBuyersFilters(searchParams);
  const apiParams = toAdminProfessionalBuyersApiParams(filters);
  const listQuery = useAdminProfessionalBuyers(apiParams);

  const createMutation = useCreateAdminProfessionalBuyer();
  const activateMutation = useActivateAdminProfessionalBuyer();
  const suspendMutation = useSuspendAdminProfessionalBuyer();
  const deleteMutation = useDeleteAdminProfessionalBuyer();

  const [qDraft, setQDraft] = useState(filters.q ?? "");
  const [prevUrlQ, setPrevUrlQ] = useState(filters.q ?? "");
  const urlQ = filters.q ?? "";
  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ);
    setQDraft(urlQ);
  }

  const [formOpen, setFormOpen] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);
  const [statusTarget, setStatusTarget] = useState<{
    row: ProfessionalBuyerDto;
    action: "activate" | "suspend";
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProfessionalBuyerDto | null>(
    null,
  );

  const viewQuery = useAdminProfessionalBuyer(viewId ?? 0, viewId != null);

  const applyFilters = useCallback(
    (next: AdminProfessionalBuyersUrlFilters) => {
      router.push(buildAdminProfessionalBuyersHref(next));
    },
    [router],
  );

  const patchFilters = useCallback(
    (patch: Partial<AdminProfessionalBuyersUrlFilters>) => {
      applyFilters({
        ...filters,
        ...patch,
        page: patch.page ?? 1,
      });
    },
    [applyFilters, filters],
  );

  const hasFilters = adminProfessionalBuyersHasActiveFilters(filters);
  const items = listQuery.data?.items ?? [];
  const totalItems = listQuery.data?.totalCount ?? 0;
  const currentPage = listQuery.data?.page ?? filters.page ?? 1;
  const totalPages = Math.max(1, listQuery.data?.totalPages ?? 1);

  const handleFormSubmit = (values: ProfessionalBuyerFormValues) => {
    createMutation.mutate(
      {
        companyName: values.companyName.trim(),
        corporateName: values.corporateName.trim(),
        document: onlyDigits(values.document),
        contactName: values.contactName.trim(),
        email: values.email.trim(),
        phone: onlyDigits(values.phone),
        whatsApp: onlyDigits(values.whatsApp),
        cityId: values.cityId,
        address: values.address.trim(),
        number: values.number.trim(),
        neighborhood: values.neighborhood.trim(),
        zipCode: normalizePostalCode(values.zipCode),
        segment: values.segment,
        temporaryPassword: values.temporaryPassword,
      },
      { onSuccess: () => setFormOpen(false) },
    );
  };

  const columns: AdminTableColumn<ProfessionalBuyerDto>[] = [
    {
      id: "companyName",
      header: "Empresa",
      cell: (row) => (
        <div className="flex min-w-[10rem] flex-col gap-0.5">
          <span className="font-medium">{row.companyName}</span>
          <span className="text-muted-foreground text-xs">
            {row.corporateName}
          </span>
        </div>
      ),
    },
    {
      id: "document",
      header: "Documento",
      accessor: (row) => formatDocumentAuto(row.document),
    },
    {
      id: "contactName",
      header: "Contato",
      accessor: (row) => row.contactName,
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
      id: "location",
      header: "Cidade / UF",
      accessor: (row) => `${row.city} / ${row.state}`,
    },
    {
      id: "segment",
      header: "Segmento",
      accessor: (row) => row.segmentLabel,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <AdminStatusBadge
          status={statusVariant(row.status)}
          label={row.statusLabel}
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
        const canActivate = !isProfessionalBuyerActive(row.status);
        const canSuspend = !isProfessionalBuyerSuspended(row.status);

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
            {canActivate ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setStatusTarget({ row, action: "activate" })
                }
              >
                Ativar
              </Button>
            ) : null}
            {canSuspend ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setStatusTarget({ row, action: "suspend" })
                }
              >
                Suspender
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(row)}
            >
              <Trash2 className="size-3.5" />
              Excluir
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <AdminPage
      title="Compradores Profissionais"
      description="Cadastre e gerencie compradores profissionais da plataforma."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Compradores Profissionais" },
      ]}
      actions={
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => setFormOpen(true)}
        >
          <Plus className="size-4" />
          Novo comprador
        </Button>
      }
    >
      <AdminFilterBar
        filters={
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex min-w-[14rem] flex-1 flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                Busca
              </label>
              <Input
                value={qDraft}
                onChange={(event) => setQDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    patchFilters({ q: qDraft.trim() || undefined });
                  }
                }}
                placeholder="Empresa, contato, e-mail ou documento"
                className="h-10"
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
                        : (event.target.value as
                            | "pending"
                            | "active"
                            | "suspended"),
                  })
                }
              >
                <option value="all">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="active">Ativos</option>
                <option value="suspended">Suspensos</option>
              </select>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10"
              onClick={() =>
                patchFilters({ q: qDraft.trim() || undefined })
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
                    sortDescending: filters.sortDescending,
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
                  sort: event.target.value as ProfessionalBuyerSortParam,
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
              value={filters.sortDescending === false ? "asc" : "desc"}
              onChange={(event) =>
                patchFilters({
                  sortDescending: event.target.value === "desc",
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
            ? `${totalItems} comprador${totalItems === 1 ? "" : "es"}`
            : "Resultados da busca e filtros aplicados."
        }
      >
        {listQuery.isError ? (
          <AdminEmptyState
            title="Não foi possível carregar os compradores"
            description={getFriendlyErrorMessage(listQuery.error)}
            icon={<BriefcaseBusiness aria-hidden />}
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
            caption="Compradores profissionais"
            emptyTitle={
              hasFilters
                ? "Nenhum resultado para os filtros aplicados"
                : "Nenhum comprador profissional encontrado"
            }
            emptyDescription={
              hasFilters
                ? "Ajuste os filtros ou limpe a busca."
                : "Cadastre o primeiro comprador profissional."
            }
            emptyAction={
              !hasFilters ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setFormOpen(true)}
                >
                  Novo comprador
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

      <ProfessionalBuyerFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isSubmitting={createMutation.isPending}
        submitError={
          createMutation.isError ? createMutation.error : undefined
        }
        onSubmit={handleFormSubmit}
      />

      <ProfessionalBuyerDetailDialog
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
          statusTarget?.action === "suspend"
            ? "Suspender comprador?"
            : "Ativar comprador?"
        }
        description={
          statusTarget
            ? statusTarget.action === "suspend"
              ? `${statusTarget.row.companyName} (${statusTarget.row.email}) ficará suspenso e não poderá acessar a plataforma.`
              : `${statusTarget.row.companyName} (${statusTarget.row.email}) será ativado e poderá acessar a plataforma.`
            : ""
        }
        confirmLabel={
          statusTarget?.action === "suspend" ? "Suspender" : "Ativar"
        }
        confirmVariant={
          statusTarget?.action === "suspend" ? "destructive" : "primary"
        }
        loading={activateMutation.isPending || suspendMutation.isPending}
        onConfirm={() => {
          if (!statusTarget) return;
          const { row, action } = statusTarget;
          const mutation =
            action === "suspend" ? suspendMutation : activateMutation;
          mutation.mutate(row.id, {
            onSuccess: () => setStatusTarget(null),
          });
        }}
      />

      <ConfirmDialog
        open={deleteTarget != null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Excluir comprador profissional?"
        description={
          deleteTarget
            ? `${deleteTarget.companyName} (${deleteTarget.email}) será removido. Esta ação não pode ser desfeita.`
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

export { AdminProfessionalBuyersView };
