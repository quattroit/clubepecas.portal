"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Eye, ExternalLink, Package } from "lucide-react";

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
import { RemoteImage } from "@/components/media/RemoteImage";
import { Pagination } from "@/components/navigation/Pagination";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminAdvertisementPath,
  adminSellerPath,
  advertisementPath,
  ROUTES,
} from "@/constants/routes";
import type {
  AdminAdvertisementListItemDto,
  AdminAdvertisementSortParam,
  AdminAdvertisementStatusFilter,
} from "@/contracts/admin/advertisements";
import { AdvertisementStatus } from "@/contracts/common/enums";
import { useAdminAdvertisements } from "@/hooks/api/useAdminAdvertisements";
import { useCategories } from "@/hooks/api/useCategories";
import { useUpdateAdminAdvertisementStatus } from "@/hooks/api/useUpdateAdminAdvertisementStatus";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { getStatusLabel } from "@/mappers/categoryMeta";
import { formatDate } from "@/utils/formatDate";
import {
  formatConversionRate,
  formatMetricCount,
} from "@/utils/formatMetrics";
import {
  adminAdvertisementHasActiveFilters,
  buildAdminAdvertisementsHref,
  parseAdminAdvertisementsFilters,
  toAdminAdvertisementsApiParams,
  type AdminAdvertisementsUrlFilters,
} from "@/utils/admin-advertisements-search";

const SORT_OPTIONS: { value: AdminAdvertisementSortParam; label: string }[] = [
  { value: "newest", label: "Mais recentes" },
  { value: "oldest", label: "Mais antigos" },
  { value: "title", label: "Título" },
  { value: "store", label: "Loja" },
  { value: "views", label: "Visualizações" },
  { value: "whatsappClicks", label: "Cliques WhatsApp" },
  { value: "conversion", label: "Conversão" },
  { value: "stock", label: "Estoque" },
];

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

function advertisementStatusVariant(
  status: AdvertisementStatus,
): "active" | "inactive" | "pending" | "blocked" | "default" {
  switch (status) {
    case AdvertisementStatus.Published:
      return "active";
    case AdvertisementStatus.Paused:
      return "pending";
    case AdvertisementStatus.Sold:
      return "inactive";
    case AdvertisementStatus.Archived:
      return "blocked";
    default:
      return "default";
  }
}

/**
 * Listagem administrativa de anúncios — URL como fonte da verdade.
 */
function AdminAdvertisementsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseAdminAdvertisementsFilters(searchParams);
  const apiParams = toAdminAdvertisementsApiParams(filters);
  const adsQuery = useAdminAdvertisements(apiParams);
  const categoriesQuery = useCategories();
  const updateStatus = useUpdateAdminAdvertisementStatus();

  const [searchDraft, setSearchDraft] = useState(filters.q ?? "");
  const [statusTarget, setStatusTarget] =
    useState<AdminAdvertisementListItemDto | null>(null);

  useEffect(() => {
    setSearchDraft(filters.q ?? "");
  }, [filters.q]);

  const applyFilters = useCallback(
    (next: AdminAdvertisementsUrlFilters) => {
      router.push(buildAdminAdvertisementsHref(next));
    },
    [router],
  );

  const patchFilters = useCallback(
    (patch: Partial<AdminAdvertisementsUrlFilters>) => {
      applyFilters({
        ...filters,
        ...patch,
        page: patch.page ?? 1,
      });
    },
    [applyFilters, filters],
  );

  const hasFilters = adminAdvertisementHasActiveFilters(filters);
  const items = adsQuery.data?.items ?? [];
  const totalItems = adsQuery.data?.totalItems ?? 0;
  const currentPage = adsQuery.data?.currentPage ?? filters.page ?? 1;
  const totalPages = Math.max(1, adsQuery.data?.totalPages ?? 1);

  const columns: AdminTableColumn<AdminAdvertisementListItemDto>[] = [
    {
      id: "image",
      header: "Imagem",
      cell: (row) => (
        <div className="bg-muted relative size-12 overflow-hidden rounded-lg">
          {row.thumbnailUrl ? (
            <RemoteImage
              src={row.thumbnailUrl}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex size-full items-center justify-center">
              <Package className="size-4" aria-hidden />
            </div>
          )}
        </div>
      ),
    },
    {
      id: "title",
      header: "Título",
      cell: (row) => (
        <Link
          href={adminAdvertisementPath(row.id)}
          className="hover:text-primary line-clamp-2 font-medium underline-offset-2 hover:underline"
        >
          {row.title}
        </Link>
      ),
    },
    {
      id: "store",
      header: "Loja",
      cell: (row) => (
        <Link
          href={adminSellerPath(row.sellerId)}
          className="hover:text-primary truncate text-sm underline-offset-2 hover:underline"
        >
          {row.storeName || "—"}
        </Link>
      ),
    },
    {
      id: "category",
      header: "Categoria",
      accessor: (row) => row.categoryName,
    },
    {
      id: "location",
      header: "Cidade / UF",
      accessor: (row) =>
        row.city ? `${row.city} — ${row.state}` : "—",
    },
    {
      id: "stock",
      header: "Estoque",
      accessor: (row) => formatMetricCount(row.stockQuantity),
      className: "tabular-nums",
    },
    {
      id: "views",
      header: "Views",
      accessor: (row) => formatMetricCount(row.views),
      className: "tabular-nums",
    },
    {
      id: "clicks",
      header: "WhatsApp",
      accessor: (row) => formatMetricCount(row.whatsappClicks),
      className: "tabular-nums",
    },
    {
      id: "conversion",
      header: "Conv.",
      accessor: (row) => formatConversionRate(row.conversionRate),
      className: "tabular-nums",
    },
    {
      id: "reports",
      header: "Denúncias",
      accessor: (row) => formatMetricCount(row.reportCount),
      className: "tabular-nums",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <AdminStatusBadge
          status={advertisementStatusVariant(row.status)}
          label={getStatusLabel(row.status)}
        />
      ),
    },
    {
      id: "publishedAt",
      header: "Publicação",
      accessor: (row) => formatDate(row.publishedAt),
    },
  ];

  return (
    <AdminPage
      title="Anúncios"
      description="Localize, acompanhe métricas e controle a disponibilidade dos anúncios."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Anúncios" },
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
              placeholder="Buscar título, loja, compatibilidade…"
              aria-label="Buscar anúncios"
              onClear={() => {
                setSearchDraft("");
                patchFilters({ q: undefined });
              }}
            />
          </form>
        }
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <select
              className={selectClassName}
              aria-label="Status"
              value={filters.status ?? "all"}
              onChange={(event) => {
                const value = event.target
                  .value as AdminAdvertisementStatusFilter;
                patchFilters({
                  status: value === "all" ? undefined : value,
                });
              }}
            >
              <option value="all">Status: todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>

            <select
              className={selectClassName}
              aria-label="Categoria"
              value={filters.categoryId ?? "all"}
              onChange={(event) => {
                const value = event.target.value;
                patchFilters({
                  categoryId:
                    value === "all" ? undefined : Number(value),
                });
              }}
            >
              <option value="all">Categoria: todas</option>
              {(categoriesQuery.data ?? [])
                .filter((category) => category.parentId == null)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>

            <Input
              type="text"
              placeholder="Loja"
              aria-label="Filtrar por loja"
              className="h-10 w-28 sm:w-36"
              defaultValue={filters.store ?? ""}
              key={`store-${filters.store ?? ""}`}
              onBlur={(event) => {
                const store = event.target.value.trim();
                if (store !== (filters.store ?? "")) {
                  patchFilters({ store: store || undefined });
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const store = (
                    event.target as HTMLInputElement
                  ).value.trim();
                  patchFilters({ store: store || undefined });
                }
              }}
            />

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
                Publicação
              </span>
              <Input
                id="admin-ads-published-from"
                type="date"
                aria-label="Publicado a partir de"
                title="Publicado a partir de"
                className="h-10 w-auto"
                value={filters.publishedFrom ?? ""}
                onChange={(event) => {
                  patchFilters({
                    publishedFrom: event.target.value || undefined,
                  });
                }}
              />
              <span className="text-muted-foreground text-xs" aria-hidden>
                até
              </span>
              <Input
                id="admin-ads-published-to"
                type="date"
                aria-label="Publicado até"
                title="Publicado até"
                className="h-10 w-auto"
                value={filters.publishedTo ?? ""}
                onChange={(event) => {
                  patchFilters({
                    publishedTo: event.target.value || undefined,
                  });
                }}
              />
            </div>

            <Input
              type="number"
              min={0}
              placeholder="Est. mín"
              aria-label="Estoque mínimo"
              className="h-10 w-24"
              defaultValue={filters.stockMin ?? ""}
              key={`stockMin-${filters.stockMin ?? ""}`}
              onBlur={(event) => {
                const stockMin = event.target.value.trim();
                if (stockMin !== (filters.stockMin ?? "")) {
                  patchFilters({ stockMin: stockMin || undefined });
                }
              }}
            />
            <Input
              type="number"
              min={0}
              placeholder="Est. máx"
              aria-label="Estoque máximo"
              className="h-10 w-24"
              defaultValue={filters.stockMax ?? ""}
              key={`stockMax-${filters.stockMax ?? ""}`}
              onBlur={(event) => {
                const stockMax = event.target.value.trim();
                if (stockMax !== (filters.stockMax ?? "")) {
                  patchFilters({ stockMax: stockMax || undefined });
                }
              }}
            />
          </div>
        }
        sort={
          <select
            className={selectClassName}
            aria-label="Ordenar por"
            value={filters.sort ?? "newest"}
            onChange={(event) => {
              const sort = event.target.value as AdminAdvertisementSortParam;
              patchFilters({
                sort: sort === "newest" ? undefined : sort,
                sortDir: undefined,
              });
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                Ordenar: {option.label}
              </option>
            ))}
          </select>
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
          adsQuery.isSuccess
            ? `${formatMetricCount(totalItems)} anúncio${totalItems === 1 ? "" : "s"}`
            : "Resultados da busca e filtros aplicados."
        }
      >
        {adsQuery.isError ? (
          <AdminEmptyState
            title="Não foi possível carregar os anúncios"
            description={getFriendlyErrorMessage(adsQuery.error)}
            icon={<Package aria-hidden />}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void adsQuery.refetch();
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
            loading={adsQuery.isLoading}
            caption="Anúncios da plataforma"
            emptyTitle={
              hasFilters
                ? "Nenhum resultado para os filtros aplicados"
                : "Nenhum anúncio encontrado"
            }
            emptyDescription={
              hasFilters
                ? "Ajuste a busca ou limpe os filtros para ver mais resultados."
                : "Assim que houver anúncios, eles aparecerão aqui."
            }
            rowActions={(row) => (
              <div className="flex flex-wrap items-center justify-end gap-1">
                <Link
                  href={adminAdvertisementPath(row.id)}
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
                  href={advertisementPath(row.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                  )}
                >
                  <ExternalLink className="size-3.5" aria-hidden />
                  Público
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
          statusTarget?.isActive ? "Inativar anúncio?" : "Ativar anúncio?"
        }
        description={
          statusTarget?.isActive
            ? `O anúncio “${statusTarget.title}” deixará de aparecer no marketplace.`
            : `O anúncio “${statusTarget?.title ?? ""}” voltará a aparecer no marketplace.`
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
            { onSuccess: () => setStatusTarget(null) },
          );
        }}
      />
    </AdminPage>
  );
}

export { AdminAdvertisementsView };
