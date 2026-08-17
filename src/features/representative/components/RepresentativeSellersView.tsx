"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, Store } from "lucide-react";

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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import type {
  RepresentativeSellerListItemDto,
  RepresentativeSellersStatusFilter,
} from "@/contracts/representative/portal";
import { useRepresentativeSeller } from "@/hooks/api/useRepresentativeSeller";
import { useRepresentativeSellers } from "@/hooks/api/useRepresentativeSellers";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

function RepresentativeSellersView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const name = searchParams.get("name") ?? "";
  const city = searchParams.get("city") ?? "";
  const planName = searchParams.get("planName") ?? "";
  const status =
    (searchParams.get("status") as RepresentativeSellersStatusFilter | null) ??
    "all";

  const [nameDraft, setNameDraft] = useState(name);
  const [cityDraft, setCityDraft] = useState(city);
  const [planDraft, setPlanDraft] = useState(planName);
  const [viewId, setViewId] = useState<number | null>(null);

  const params = useMemo(
    () => ({
      page,
      pageSize: 20,
      name: name || undefined,
      city: city || undefined,
      planName: planName || undefined,
      status,
    }),
    [page, name, city, planName, status],
  );

  const listQuery = useRepresentativeSellers(params);
  const detailQuery = useRepresentativeSeller(viewId ?? 0, viewId != null);

  const patch = (next: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all") sp.delete(key);
      else sp.set(key, value);
    });
    if (!("page" in next)) sp.set("page", "1");
    const qs = sp.toString();
    router.push(
      qs ? `${ROUTES.REPRESENTATIVE_SELLERS}?${qs}` : ROUTES.REPRESENTATIVE_SELLERS,
    );
  };

  const items = listQuery.data?.items ?? [];
  const totalItems = listQuery.data?.totalItems ?? 0;
  const totalPages = Math.max(1, listQuery.data?.totalPages ?? 1);
  const hasFilters = Boolean(name || city || planName || status !== "all");

  const columns: AdminTableColumn<RepresentativeSellerListItemDto>[] = [
    {
      id: "storeName",
      header: "Loja",
      accessor: (row) => row.storeName,
    },
    {
      id: "location",
      header: "Cidade / UF",
      accessor: (row) => `${row.city} / ${row.state}`,
    },
    {
      id: "plan",
      header: "Plano",
      accessor: (row) => row.planName ?? "—",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <AdminStatusBadge status={row.isActive ? "active" : "inactive"} />
      ),
    },
    {
      id: "createdAt",
      header: "Cadastro",
      accessor: (row) => formatDate(row.createdAt),
    },
    {
      id: "lastSubscription",
      header: "Última assinatura",
      accessor: (row) =>
        row.lastSubscriptionAt ? formatDate(row.lastSubscriptionAt) : "—",
    },
    {
      id: "actions",
      header: "Ações",
      cell: (row) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setViewId(row.id)}
        >
          <Eye className="size-3.5" />
          Detalhes
        </Button>
      ),
    },
  ];

  return (
    <AdminPage
      title="Vendedores"
      description="Vendedores vinculados à sua indicação."
    >
      <AdminFilterBar
        filters={
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex min-w-[10rem] flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                Nome / Loja
              </label>
              <Input
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    patch({ name: nameDraft.trim() || undefined });
                  }
                }}
                placeholder="Buscar por nome"
                className="h-10"
              />
            </div>
            <div className="flex min-w-[10rem] flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                Cidade
              </label>
              <Input
                value={cityDraft}
                onChange={(event) => setCityDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    patch({ city: cityDraft.trim() || undefined });
                  }
                }}
                placeholder="Buscar por cidade"
                className="h-10"
              />
            </div>
            <div className="flex min-w-[10rem] flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                Plano
              </label>
              <Input
                value={planDraft}
                onChange={(event) => setPlanDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    patch({ planName: planDraft.trim() || undefined });
                  }
                }}
                placeholder="Nome do plano"
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                Status
              </label>
              <select
                className={selectClassName}
                value={status}
                onChange={(event) =>
                  patch({ status: event.target.value })
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
                patch({
                  name: nameDraft.trim() || undefined,
                  city: cityDraft.trim() || undefined,
                  planName: planDraft.trim() || undefined,
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
                onClick={() => {
                  setNameDraft("");
                  setCityDraft("");
                  setPlanDraft("");
                  router.push(ROUTES.REPRESENTATIVE_SELLERS);
                }}
              >
                Limpar
              </Button>
            ) : null}
          </div>
        }
      />

      <AdminSection
        title="Listagem"
        description={
          listQuery.isSuccess
            ? `${totalItems} vendedor${totalItems === 1 ? "" : "es"}`
            : "Resultados da busca e filtros aplicados."
        }
      >
        {listQuery.isError ? (
          <AdminEmptyState
            title="Não foi possível carregar os vendedores"
            description={getFriendlyErrorMessage(listQuery.error)}
            icon={<Store aria-hidden />}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void listQuery.refetch()}
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
            caption="Vendedores vinculados"
            emptyTitle={
              hasFilters
                ? "Nenhum resultado para os filtros aplicados"
                : "Nenhum vendedor vinculado ainda"
            }
            emptyDescription={
              hasFilters
                ? "Ajuste os filtros ou limpe a busca."
                : "Compartilhe seu link de indicação para vincular novos vendedores."
            }
            pagination={
              totalPages > 1 ? (
                <Pagination
                  currentPage={listQuery.data?.currentPage ?? page}
                  totalPages={totalPages}
                  onPageChange={(nextPage) =>
                    patch({ page: String(nextPage) })
                  }
                />
              ) : null
            }
          />
        )}
      </AdminSection>

      <Dialog
        open={viewId != null}
        onOpenChange={(open) => {
          if (!open) setViewId(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do vendedor</DialogTitle>
            <DialogDescription>
              Informações somente leitura do vendedor vinculado.
            </DialogDescription>
          </DialogHeader>
          {detailQuery.isLoading ? (
            <p className="text-muted-foreground text-sm">Carregando…</p>
          ) : detailQuery.data ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              <Detail label="Loja" value={detailQuery.data.storeName} />
              <Detail
                label="Cidade / UF"
                value={`${detailQuery.data.city} / ${detailQuery.data.state}`}
              />
              <Detail label="E-mail" value={detailQuery.data.email} />
              <Detail label="WhatsApp" value={detailQuery.data.whatsApp} />
              <Detail
                label="Plano"
                value={detailQuery.data.planName ?? "—"}
              />
              <Detail
                label="Status"
                value={detailQuery.data.isActive ? "Ativo" : "Inativo"}
              />
              <Detail
                label="Cadastro"
                value={formatDate(detailQuery.data.createdAt)}
              />
              {detailQuery.data.description ? (
                <div className="flex flex-col gap-0.5 sm:col-span-2">
                  <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Descrição
                  </dt>
                  <dd className="text-sm">{detailQuery.data.description}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Fechar
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}

export { RepresentativeSellersView };
