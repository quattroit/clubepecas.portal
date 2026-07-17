"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  BarChart3,
  Eye,
  FolderTree,
  MapPin,
  MessageCircle,
  Package,
  Percent,
  Radio,
  Store,
  Users,
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
  AdminTable,
} from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin";
import { RemoteImage } from "@/components/media/RemoteImage";
import { Button } from "@/components/ui/button";
import {
  adminAdvertisementPath,
  adminSellerPath,
  advertisementPath,
  ROUTES,
} from "@/constants/routes";
import type {
  AdminAnalyticsCategoryRankDto,
  AdminAnalyticsCityRankDto,
  AdminAnalyticsListingRankDto,
  AdminAnalyticsStoreRankDto,
  AdminAnalyticsTrafficSourceDto,
  MetricsPeriodParam,
} from "@/contracts/admin/analytics";
import type { AdminActivityItemDto } from "@/contracts/admin/dashboard";
import { useAdminAnalytics } from "@/hooks/api/useAdminAnalytics";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import {
  formatChangePercent,
  formatConversionRate,
  formatMetricCount,
} from "@/utils/formatMetrics";

const PERIOD_OPTIONS: { value: MetricsPeriodParam; label: string }[] = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
  { value: "all", label: "Todo período" },
];

const EMPTY =
  "O marketplace ainda não possui dados suficientes para exibir este indicador.";

function parsePeriod(value: string | null): MetricsPeriodParam {
  if (value === "7d" || value === "30d" || value === "90d" || value === "all") {
    return value;
  }
  return "all";
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function metricChange(value: number | null | undefined) {
  return formatChangePercent(value);
}

/**
 * Painel executivo de Analytics — uma chamada GET /admin/analytics.
 */
function AdminAnalyticsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const period = parsePeriod(searchParams.get("period"));
  const analyticsQuery = useAdminAnalytics(period);
  const data = analyticsQuery.data;
  const summary = data?.summary;

  const setPeriod = (next: MetricsPeriodParam) => {
    if (next === "all") {
      router.push(ROUTES.ADMIN_ANALYTICS);
      return;
    }
    router.push(`${ROUTES.ADMIN_ANALYTICS}?period=${next}`);
  };

  const storeColumns: AdminTableColumn<AdminAnalyticsStoreRankDto>[] = [
    {
      id: "store",
      header: "Loja",
      cell: (row) => (
        <Link
          href={adminSellerPath(row.id)}
          className="hover:text-primary font-medium underline-offset-2 hover:underline"
        >
          {row.storeName}
        </Link>
      ),
    },
    {
      id: "city",
      header: "Cidade",
      accessor: (row) => `${row.city} — ${row.state}`,
    },
    {
      id: "ads",
      header: "Anúncios",
      accessor: (row) => formatMetricCount(row.advertisementCount),
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
      header: "Conversão",
      accessor: (row) => formatConversionRate(row.conversionRate),
      className: "tabular-nums",
    },
  ];

  const listingColumns: AdminTableColumn<AdminAnalyticsListingRankDto>[] = [
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
        <div className="flex min-w-0 flex-col gap-0.5">
          <Link
            href={adminAdvertisementPath(row.id)}
            className="hover:text-primary line-clamp-2 font-medium underline-offset-2 hover:underline"
          >
            {row.title}
          </Link>
          <Link
            href={advertisementPath(row.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary text-xs underline-offset-2 hover:underline"
          >
            Abrir público
          </Link>
        </div>
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
      id: "views",
      header: "Views",
      accessor: (row) => formatMetricCount(row.views),
      className: "tabular-nums",
    },
    {
      id: "clicks",
      header: "Cliques",
      accessor: (row) => formatMetricCount(row.whatsappClicks),
      className: "tabular-nums",
    },
    {
      id: "conversion",
      header: "Conversão",
      accessor: (row) => formatConversionRate(row.conversionRate),
      className: "tabular-nums",
    },
  ];

  const categoryColumns: AdminTableColumn<AdminAnalyticsCategoryRankDto>[] = [
    {
      id: "category",
      header: "Categoria",
      accessor: (row) => row.categoryName,
    },
    {
      id: "ads",
      header: "Anúncios",
      accessor: (row) => formatMetricCount(row.advertisementCount),
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
      header: "Cliques",
      accessor: (row) => formatMetricCount(row.whatsappClicks),
      className: "tabular-nums",
    },
    {
      id: "conversion",
      header: "Conversão",
      accessor: (row) => formatConversionRate(row.conversionRate),
      className: "tabular-nums",
    },
  ];

  const cityColumns: AdminTableColumn<AdminAnalyticsCityRankDto>[] = [
    {
      id: "city",
      header: "Cidade",
      accessor: (row) => `${row.city} — ${row.state}`,
    },
    {
      id: "stores",
      header: "Lojas",
      accessor: (row) => formatMetricCount(row.storeCount),
      className: "tabular-nums",
    },
    {
      id: "ads",
      header: "Anúncios",
      accessor: (row) => formatMetricCount(row.advertisementCount),
      className: "tabular-nums",
    },
    {
      id: "views",
      header: "Views",
      accessor: (row) => formatMetricCount(row.views),
      className: "tabular-nums",
    },
    {
      id: "conversion",
      header: "Conversão",
      accessor: (row) => formatConversionRate(row.conversionRate),
      className: "tabular-nums",
    },
  ];

  const trafficColumns: AdminTableColumn<AdminAnalyticsTrafficSourceDto>[] = [
    {
      id: "label",
      header: "Origem",
      accessor: (row) => row.label,
    },
    {
      id: "events",
      header: "Eventos",
      accessor: (row) => formatMetricCount(row.events),
      className: "tabular-nums",
    },
    {
      id: "percent",
      header: "%",
      accessor: (row) =>
        `${row.percent.toLocaleString("pt-BR", {
          maximumFractionDigits: 1,
        })}%`,
      className: "tabular-nums",
    },
  ];

  return (
    <AdminPage
      title="Analytics"
      description="Visão executiva do marketplace — crescimento, rankings e conversão."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Analytics" },
      ]}
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

      {analyticsQuery.isError ? (
        <AdminSection title="Erro ao carregar">
          <AdminCard>
            <AdminEmptyState
              title="Não foi possível carregar o Analytics"
              description={getFriendlyErrorMessage(analyticsQuery.error)}
              icon={<BarChart3 aria-hidden />}
              action={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void analyticsQuery.refetch();
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
        title="Resumo executivo"
        description={
          data?.hasComparison
            ? "Indicadores do período com variação vs período anterior."
            : "Indicadores do período selecionado."
        }
      >
        {analyticsQuery.isLoading ? (
          <AdminStatsGrid aria-label="Carregando resumo">
            {Array.from({ length: 8 }).map((_, index) => (
              <AdminMetricCardSkeleton key={index} />
            ))}
          </AdminStatsGrid>
        ) : summary ? (
          <AdminStatsGrid aria-label="Resumo executivo">
            <AdminMetricCard
              title="Novos vendedores"
              value={formatMetricCount(summary.newSellers)}
              icon={<Users className="size-4" />}
              {...(() => {
                const change = metricChange(summary.newSellersChangePercent);
                return change
                  ? { change: change.label, trend: change.trend }
                  : {};
              })()}
            />
            <AdminMetricCard
              title="Novos anúncios"
              value={formatMetricCount(summary.newAdvertisements)}
              icon={<Package className="size-4" />}
              {...(() => {
                const change = metricChange(
                  summary.newAdvertisementsChangePercent,
                );
                return change
                  ? { change: change.label, trend: change.trend }
                  : {};
              })()}
            />
            <AdminMetricCard
              title="Visualizações"
              value={formatMetricCount(summary.views)}
              icon={<Eye className="size-4" />}
              {...(() => {
                const change = metricChange(summary.viewsChangePercent);
                return change
                  ? { change: change.label, trend: change.trend }
                  : {};
              })()}
            />
            <AdminMetricCard
              title="Cliques no WhatsApp"
              value={formatMetricCount(summary.whatsappClicks)}
              icon={<MessageCircle className="size-4" />}
              {...(() => {
                const change = metricChange(
                  summary.whatsappClicksChangePercent,
                );
                return change
                  ? { change: change.label, trend: change.trend }
                  : {};
              })()}
            />
            <AdminMetricCard
              title="Conversão geral"
              value={formatConversionRate(summary.conversionRate)}
              icon={<Percent className="size-4" />}
              description="Cliques ÷ visualizações"
              {...(() => {
                const change = metricChange(
                  summary.conversionRateChangePercent,
                );
                return change
                  ? {
                      change: `${change.label.replace("%", " pp")}`,
                      trend: change.trend,
                    }
                  : {};
              })()}
            />
            <AdminMetricCard
              title="Vendedores online"
              value={formatMetricCount(summary.onlineSellers)}
              icon={<Radio className="size-4" />}
              description="Últimos 15 minutos"
            />
            <AdminMetricCard
              title="Lojas ativas"
              value={formatMetricCount(summary.activeStores)}
              icon={<Store className="size-4" />}
            />
            <AdminMetricCard
              title="Cidades atendidas"
              value={formatMetricCount(summary.citiesServed)}
              icon={<MapPin className="size-4" />}
            />
          </AdminStatsGrid>
        ) : null}
      </AdminSection>

      <AdminSection title="Top lojas" description="Melhor desempenho por visualizações.">
        <AdminTable
          columns={storeColumns}
          data={data?.topStores ?? []}
          getRowId={(row) => row.id}
          loading={analyticsQuery.isLoading}
          caption="Ranking de lojas"
          emptyTitle="Sem lojas no ranking"
          emptyDescription={EMPTY}
        />
      </AdminSection>

      <AdminSection title="Top anúncios" description="Melhor desempenho por visualizações.">
        <AdminTable
          columns={listingColumns}
          data={data?.topListings ?? []}
          getRowId={(row) => row.id}
          loading={analyticsQuery.isLoading}
          caption="Ranking de anúncios"
          emptyTitle="Sem anúncios no ranking"
          emptyDescription={EMPTY}
        />
      </AdminSection>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AdminSection title="Top categorias">
          <AdminTable
            columns={categoryColumns}
            data={data?.topCategories ?? []}
            getRowId={(row) => row.categoryId}
            loading={analyticsQuery.isLoading}
            caption="Ranking de categorias"
            emptyTitle="Sem categorias no ranking"
            emptyDescription={EMPTY}
          />
        </AdminSection>

        <AdminSection title="Top cidades">
          <AdminTable
            columns={cityColumns}
            data={data?.topCities ?? []}
            getRowId={(row) => `${row.city}-${row.state}`}
            loading={analyticsQuery.isLoading}
            caption="Ranking de cidades"
            emptyTitle="Sem cidades no ranking"
            emptyDescription={EMPTY}
          />
        </AdminSection>
      </div>

      <AdminSection
        title="Origem do tráfego"
        description="Distribuição dos eventos por referer classificado."
      >
        <AdminTable
          columns={trafficColumns}
          data={data?.trafficSources ?? []}
          getRowId={(row) => String(row.source)}
          loading={analyticsQuery.isLoading}
          caption="Origens de tráfego"
          emptyTitle="Sem dados de tráfego"
          emptyDescription={EMPTY}
        />
      </AdminSection>

      <AdminSection
        title="Conversão"
        description={`Geral: ${formatConversionRate(data?.conversion.overallRate)}. Rankings por taxa (mín. 1 visualização).`}
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <AdminCard title="Por loja">
            <AdminTable
              columns={storeColumns.filter((c) =>
                ["store", "views", "conversion"].includes(c.id),
              )}
              data={data?.conversion.byStore ?? []}
              getRowId={(row) => `conv-store-${row.id}`}
              loading={analyticsQuery.isLoading}
              emptyTitle="Sem dados"
              emptyDescription={EMPTY}
            />
          </AdminCard>
          <AdminCard title="Por categoria">
            <AdminTable
              columns={categoryColumns.filter((c) =>
                ["category", "views", "conversion"].includes(c.id),
              )}
              data={data?.conversion.byCategory ?? []}
              getRowId={(row) => `conv-cat-${row.categoryId}`}
              loading={analyticsQuery.isLoading}
              emptyTitle="Sem dados"
              emptyDescription={EMPTY}
            />
          </AdminCard>
          <AdminCard title="Por cidade">
            <AdminTable
              columns={cityColumns.filter((c) =>
                ["city", "views", "conversion"].includes(c.id),
              )}
              data={data?.conversion.byCity ?? []}
              getRowId={(row) => `conv-city-${row.city}-${row.state}`}
              loading={analyticsQuery.isLoading}
              emptyTitle="Sem dados"
              emptyDescription={EMPTY}
            />
          </AdminCard>
        </div>
      </AdminSection>

      <AdminSection
        title="Atividade recente"
        description="Eventos operacionais mais recentes no período."
      >
        {analyticsQuery.isLoading ? (
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
              description={EMPTY}
              icon={<FolderTree aria-hidden />}
            />
          </AdminCard>
        )}
      </AdminSection>
    </AdminPage>
  );
}

export { AdminAnalyticsView };
