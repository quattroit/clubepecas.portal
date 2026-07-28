"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  Eye,
  FolderTree,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  Package,
  Percent,
  Radio,
  RefreshCw,
  Store,
  Trophy,
  Users,
  Wallet,
  ClipboardCheck,
  CircleCheck,
  CircleX,
} from "lucide-react";

import {
  AdminCard,
  AdminEmptyState,
  AdminFilterBar,
  AdminMetricCard,
  AdminMetricCardSkeleton,
  AdminPage,
  AdminSection,
  AdminStatsGrid,
  AdminStatusBadge,
  AdminTable,
  AdminTableSkeleton,
} from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin";
import { RemoteImage } from "@/components/media/RemoteImage";
import { Button } from "@/components/ui/button";
import {
  advertisementPath,
  ROUTES,
  storePath,
} from "@/constants/routes";
import type {
  AdminActivityItemDto,
  AdminRecentAdvertisementDto,
  AdminRecentSellerDto,
  MetricsPeriodParam,
} from "@/contracts/admin/dashboard";
import { AdvertisementStatus } from "@/contracts/common/enums";
import { useAdminDashboard } from "@/hooks/api/useAdminDashboard";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { getStatusLabel } from "@/mappers/categoryMeta";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import {
  formatConversionRate,
  formatMetricCount,
} from "@/utils/formatMetrics";

const PERIOD_OPTIONS: { value: MetricsPeriodParam; label: string }[] = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
  { value: "all", label: "Todo período" },
];

const EMPTY_INDICATOR =
  "O marketplace ainda não possui dados suficientes para exibir este indicador.";

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

const recentSellerColumns: AdminTableColumn<AdminRecentSellerDto>[] = [
  {
    id: "store",
    header: "Loja",
    cell: (row) => (
      <Link
        href={storePath(row.slug)}
        className="text-foreground hover:text-primary font-medium underline-offset-2 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {row.storeName}
      </Link>
    ),
  },
  {
    id: "city",
    header: "Cidade",
    accessor: (row) => row.city,
  },
  {
    id: "state",
    header: "Estado",
    accessor: (row) => row.state,
  },
  {
    id: "createdAt",
    header: "Cadastro",
    accessor: (row) => formatDate(row.createdAt),
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <AdminStatusBadge status={row.isActive ? "active" : "inactive"} />
    ),
  },
  {
    id: "plan",
    header: "Plano",
    cell: (row) => <AdminStatusBadge status="basic" label={row.plan} />,
  },
];

const recentAdColumns: AdminTableColumn<AdminRecentAdvertisementDto>[] = [
  {
    id: "title",
    header: "Título",
    cell: (row) => (
      <Link
        href={advertisementPath(row.slug)}
        className="text-foreground hover:text-primary font-medium underline-offset-2 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {row.title}
      </Link>
    ),
  },
  {
    id: "store",
    header: "Loja",
    accessor: (row) => row.storeName || "—",
  },
  {
    id: "category",
    header: "Categoria",
    accessor: (row) => row.categoryName,
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

/**
 * Dashboard administrativo — consome GET /api/v1/admin/dashboard.
 */
function AdminDashboardView() {
  const [period, setPeriod] = useState<MetricsPeriodParam>("all");
  const dashboardQuery = useAdminDashboard(period);
  const isRefreshing =
    dashboardQuery.isFetching && !dashboardQuery.isLoading;
  const data = dashboardQuery.data;
  const summary = data?.summary;

  return (
    <AdminPage
      title="Painel Administrativo"
      description="Visão consolidada do marketplace ClubePeças."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Dashboard" },
      ]}
      actions={
        <Button
          type="button"
          variant="primary"
          size="sm"
          aria-label="Atualizar dashboard"
          disabled={dashboardQuery.isFetching}
          aria-busy={isRefreshing}
          onClick={() => {
            void dashboardQuery.refetch();
          }}
        >
          <RefreshCw
            className={cn("size-3.5", isRefreshing && "animate-spin")}
            aria-hidden
          />
          Atualizar
        </Button>
      }
    >
      <AdminFilterBar
        period={
          <div
            role="group"
            aria-label="Período das métricas"
            className="bg-muted/60 flex flex-wrap gap-1 rounded-xl p-1"
          >
            {PERIOD_OPTIONS.map((option) => {
              const selected = period === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  className={cn(
                    "focus-visible:ring-ring rounded-lg px-3 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-2",
                    selected
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => setPeriod(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        }
      />

      {dashboardQuery.isError ? (
        <AdminSection title="Erro ao carregar">
          <AdminCard>
            <AdminEmptyState
              title="Não foi possível carregar o dashboard"
              description={getFriendlyErrorMessage(dashboardQuery.error)}
              icon={<LayoutDashboard aria-hidden />}
              action={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void dashboardQuery.refetch();
                  }}
                >
                  Tentar novamente
                </Button>
              }
            />
          </AdminCard>
        </AdminSection>
      ) : null}

      <AdminSection
        title="Indicadores"
        description="Métricas operacionais da plataforma no período selecionado."
      >
        {dashboardQuery.isLoading ? (
          <AdminStatsGrid aria-label="Carregando indicadores">
            {Array.from({ length: 18 }).map((_, index) => (
              <AdminMetricCardSkeleton key={index} />
            ))}
          </AdminStatsGrid>
        ) : summary ? (
          <AdminStatsGrid aria-label="Indicadores do marketplace">
            <AdminMetricCard
              title="Total de vendedores"
              value={formatMetricCount(summary.totalSellers)}
              icon={<Users className="size-4" />}
              description="Cadastros na plataforma"
            />
            <AdminMetricCard
              title="Lojas ativas"
              value={formatMetricCount(summary.activeStores)}
              icon={<Store className="size-4" />}
              description="Com status ativo"
            />
            <AdminMetricCard
              title="Total de anúncios"
              value={formatMetricCount(summary.totalAdvertisements)}
              icon={<Package className="size-4" />}
              description="Todos os status"
            />
            <AdminMetricCard
              title="Categorias"
              value={formatMetricCount(summary.categories)}
              icon={<FolderTree className="size-4" />}
              description="Categorias disponíveis"
            />
            <AdminMetricCard
              title="Visualizações"
              value={formatMetricCount(summary.views)}
              icon={<Eye className="size-4" />}
              description="Lojas e anúncios no período"
            />
            <AdminMetricCard
              title="Cliques no WhatsApp"
              value={formatMetricCount(summary.whatsappClicks)}
              icon={<MessageCircle className="size-4" />}
              description="Contatos gerados no período"
            />
            <AdminMetricCard
              title="Conversão geral"
              value={formatConversionRate(summary.conversionRate)}
              icon={<Percent className="size-4" />}
              description="Cliques WhatsApp ÷ visualizações"
            />
            <AdminMetricCard
              title="Cidades atendidas"
              value={formatMetricCount(summary.citiesServed)}
              icon={<MapPin className="size-4" />}
              description="Lojas ativas com cidade"
            />
            <AdminMetricCard
              title="Vendedores online"
              value={formatMetricCount(summary.onlineSellers)}
              icon={<Radio className="size-4" />}
              description="Atividade nos últimos 15 minutos"
            />
            <AdminMetricCard
              title="Total de comissões"
              value={formatCurrency(summary.totalCommissionsAmount ?? 0)}
              icon={<Wallet className="size-4" />}
              description="Soma registrada (histórico)"
            />
            <AdminMetricCard
              title="Comissões pendentes"
              value={formatCurrency(summary.pendingCommissionsAmount ?? 0)}
              description="Aguardando aprovação"
            />
            <AdminMetricCard
              title="Comissões aprovadas"
              value={formatCurrency(summary.approvedCommissionsAmount ?? 0)}
              description="Prontas para pagamento futuro"
            />
            <AdminMetricCard
              title="Comissões pagas"
              value={formatCurrency(summary.paidCommissionsAmount ?? 0)}
              description="Já liquidadas"
            />
            <AdminMetricCard
              title="Reps. com comissão"
              value={formatMetricCount(
                summary.representativesWithCommission ?? 0,
              )}
              description="Representantes com ao menos um registro"
            />
            <AdminMetricCard
              title="Solicitações finalizadas"
              value={formatMetricCount(summary.completedPartRequests ?? 0)}
              icon={<ClipboardCheck className="size-4" />}
              description="Solicitações concluídas"
            />
            <AdminMetricCard
              title="Taxa geral de sucesso"
              value={formatConversionRate(summary.partRequestSuccessRate)}
              icon={<Percent className="size-4" />}
              description="Peças encontradas ÷ finalizadas"
            />
            <AdminMetricCard
              title="Peças encontradas"
              value={formatMetricCount(summary.partsFound ?? 0)}
              icon={<CircleCheck className="size-4" />}
              description="Outcome Found"
            />
            <AdminMetricCard
              title="Peças não encontradas"
              value={formatMetricCount(summary.partsNotFound ?? 0)}
              icon={<CircleX className="size-4" />}
              description="Outcome NotFound"
            />
          </AdminStatsGrid>
        ) : null}
      </AdminSection>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AdminSection title="Melhor loja" description="Maior número de visualizações no período.">
          {dashboardQuery.isLoading ? (
            <AdminCard>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="bg-muted size-16 shrink-0 animate-pulse rounded-xl" />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="bg-muted h-5 w-40 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-28 animate-pulse rounded" />
                  <div className="bg-muted h-10 w-full animate-pulse rounded" />
                </div>
              </div>
            </AdminCard>
          ) : data?.bestStore ? (
            <AdminCard
              title={data.bestStore.storeName}
              description={`${data.bestStore.city} — ${data.bestStore.state}`}
              actions={
                <span className="text-muted-foreground inline-flex items-center gap-1 text-xs font-medium">
                  <Trophy className="size-3.5 text-amber-600" aria-hidden />
                  Destaque
                </span>
              }
              footer={
                <Link
                  href={storePath(data.bestStore.slug)}
                  className="text-primary text-sm font-medium underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir loja pública
                </Link>
              }
            >
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <dt className="text-muted-foreground text-xs">Anúncios</dt>
                  <dd className="text-price text-base tabular-nums">
                    {formatMetricCount(data.bestStore.advertisementCount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Visualizações</dt>
                  <dd className="text-price text-base tabular-nums">
                    {formatMetricCount(data.bestStore.views)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">WhatsApp</dt>
                  <dd className="text-price text-base tabular-nums">
                    {formatMetricCount(data.bestStore.whatsappClicks)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Conversão</dt>
                  <dd className="text-price text-base tabular-nums">
                    {formatConversionRate(data.bestStore.conversionRate)}
                  </dd>
                </div>
              </dl>
            </AdminCard>
          ) : (
            <AdminCard>
              <AdminEmptyState
                title="Sem loja em destaque"
                description={EMPTY_INDICATOR}
                icon={<Store aria-hidden />}
              />
            </AdminCard>
          )}
        </AdminSection>

        <AdminSection
          title="Melhor anúncio"
          description="Maior número de visualizações no período."
        >
          {dashboardQuery.isLoading ? (
            <AdminCard>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="bg-muted aspect-[5/3] w-full animate-pulse rounded-xl sm:size-28 sm:aspect-square" />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="bg-muted h-5 w-48 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                  <div className="bg-muted h-10 w-full animate-pulse rounded" />
                </div>
              </div>
            </AdminCard>
          ) : data?.bestListing ? (
            <AdminCard
              footer={
                <Link
                  href={advertisementPath(data.bestListing.slug)}
                  className="text-primary text-sm font-medium underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir anúncio público
                </Link>
              }
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <div className="bg-muted relative aspect-[5/3] w-full shrink-0 overflow-hidden rounded-xl sm:aspect-square sm:size-28">
                  {data.bestListing.thumbnailUrl ? (
                    <RemoteImage
                      src={data.bestListing.thumbnailUrl}
                      alt={`Foto de ${data.bestListing.title}`}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground flex size-full items-center justify-center">
                      <Package className="size-8" aria-hidden />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground inline-flex items-center gap-1 text-xs font-medium">
                      <Trophy className="size-3.5 text-amber-600" aria-hidden />
                      Melhor anúncio
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {data.bestListing.categoryName}
                    </span>
                  </div>

                  <p className="text-h3 truncate">{data.bestListing.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {data.bestListing.storeName || "Loja não informada"}
                  </p>

                  <dl className="grid grid-cols-3 gap-3">
                    <div>
                      <dt className="text-muted-foreground text-xs">
                        Visualizações
                      </dt>
                      <dd className="text-price text-base tabular-nums">
                        {formatMetricCount(data.bestListing.views)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground text-xs">Cliques</dt>
                      <dd className="text-price text-base tabular-nums">
                        {formatMetricCount(data.bestListing.whatsappClicks)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground text-xs">Conversão</dt>
                      <dd className="text-price text-base tabular-nums">
                        {formatConversionRate(data.bestListing.conversionRate)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </AdminCard>
          ) : (
            <AdminCard>
              <AdminEmptyState
                title="Sem anúncio em destaque"
                description={EMPTY_INDICATOR}
                icon={<Package aria-hidden />}
              />
            </AdminCard>
          )}
        </AdminSection>
      </div>

      <AdminSection
        title="Últimos vendedores"
        description="Cadastros mais recentes na plataforma."
      >
        {dashboardQuery.isLoading ? (
          <AdminTableSkeleton columns={6} />
        ) : (
          <AdminTable
            columns={recentSellerColumns}
            data={data?.recentSellers ?? []}
            getRowId={(row) => row.id}
            caption="Últimos vendedores cadastrados"
            emptyTitle="Nenhum vendedor cadastrado"
            emptyDescription={EMPTY_INDICATOR}
          />
        )}
      </AdminSection>

      <AdminSection
        title="Últimos anúncios"
        description="Publicações mais recentes no marketplace."
      >
        {dashboardQuery.isLoading ? (
          <AdminTableSkeleton columns={5} />
        ) : (
          <AdminTable
            columns={recentAdColumns}
            data={data?.recentAdvertisements ?? []}
            getRowId={(row) => row.id}
            caption="Últimos anúncios publicados"
            emptyTitle="Nenhum anúncio cadastrado"
            emptyDescription={EMPTY_INDICATOR}
          />
        )}
      </AdminSection>

      <AdminSection
        title="Atividade recente"
        description="Eventos operacionais mais recentes da plataforma."
      >
        {dashboardQuery.isLoading ? (
          <AdminCard>
            <ul className="flex flex-col gap-3" aria-busy>
              {Array.from({ length: 5 }).map((_, index) => (
                <li
                  key={index}
                  className="bg-muted h-12 animate-pulse rounded-lg"
                />
              ))}
            </ul>
          </AdminCard>
        ) : (data?.recentActivity.length ?? 0) > 0 ? (
          <AdminCard>
            <ul className="divide-border flex flex-col divide-y">
              {(data?.recentActivity ?? []).map(
                (item: AdminActivityItemDto, index) => (
                  <li
                    key={`${item.type}-${item.entityId ?? "x"}-${item.occurredAt}-${index}`}
                    className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className="bg-primary/10 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg"
                        aria-hidden
                      >
                        <Activity className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{item.title}</p>
                        {item.href ? (
                          <Link
                            href={item.href}
                            className="text-muted-foreground hover:text-primary block truncate text-sm underline-offset-2 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.description}
                          </Link>
                        ) : (
                          <p className="text-muted-foreground truncate text-sm">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <time
                      dateTime={item.occurredAt}
                      className="text-muted-foreground shrink-0 text-xs tabular-nums sm:text-right"
                    >
                      {formatDateTime(item.occurredAt)}
                    </time>
                  </li>
                ),
              )}
            </ul>
          </AdminCard>
        ) : (
          <AdminCard>
            <AdminEmptyState
              title="Nenhuma atividade recente"
              description={EMPTY_INDICATOR}
              icon={<Activity aria-hidden />}
            />
          </AdminCard>
        )}
      </AdminSection>
    </AdminPage>
  );
}

export { AdminDashboardView };
