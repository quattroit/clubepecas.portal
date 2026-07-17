"use client";

import { useState } from "react";
import {
  Eye,
  MessageCircle,
  Percent,
  RefreshCw,
  Store,
  TrendingUp,
} from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BestListingCard } from "@/features/dashboard/components/metrics/BestListingCard";
import { MetricCard } from "@/features/dashboard/components/metrics/MetricCard";
import { MetricsGrid } from "@/features/dashboard/components/metrics/MetricsGrid";
import { SellerMetricsSkeleton } from "@/features/dashboard/components/metrics/SellerMetricsSkeleton";
import { TopListingsTable } from "@/features/dashboard/components/metrics/TopListingsTable";
import type { MetricsPeriodParam } from "@/contracts/seller/metrics";
import { useSellerMetrics } from "@/hooks/api/useSellerMetrics";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
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

type SellerMetricsSectionProps = {
  className?: string;
};

/**
 * Seção de métricas do painel do vendedor — consome Analytics consolidado.
 */
function SellerMetricsSection({ className }: SellerMetricsSectionProps) {
  const [period, setPeriod] = useState<MetricsPeriodParam>("all");
  const metricsQuery = useSellerMetrics(period);
  const isRefreshing =
    metricsQuery.isFetching && !metricsQuery.isLoading;

  return (
    <section
      aria-labelledby="metrics-heading"
      className={cn("flex flex-col gap-5", className)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="metrics-heading" className="text-h2">
          Métricas
        </h2>

        <div className="flex flex-wrap items-center gap-2">
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

          <Button
            type="button"
            variant="primary"
            size="sm"
            aria-label="Atualizar métricas"
            disabled={metricsQuery.isFetching}
            aria-busy={isRefreshing}
            onClick={() => {
              void metricsQuery.refetch();
            }}
          >
            <RefreshCw
              className={cn("size-3.5", isRefreshing && "animate-spin")}
              aria-hidden
            />
            Atualizar
          </Button>
        </div>
      </div>

      {metricsQuery.isLoading ? <SellerMetricsSkeleton /> : null}

      {metricsQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar as métricas"
          message={getFriendlyErrorMessage(metricsQuery.error)}
          className="border-border bg-muted/30 text-muted-foreground [&_p]:text-muted-foreground"
        />
      ) : null}

      {metricsQuery.isSuccess && !metricsQuery.data.hasData ? (
        <EmptyState
          title="Ainda não há dados suficientes"
          description="Assim que seus anúncios começarem a receber visitas, as métricas aparecerão aqui."
          icon={<TrendingUp aria-hidden />}
        />
      ) : null}

      {metricsQuery.isSuccess && metricsQuery.data.hasData ? (
        <>
          <div className="flex flex-col gap-3">
            <h3 className="text-h3">Loja</h3>
            <MetricsGrid aria-label="Métricas da loja">
              <MetricCard
                label="Visualizações da loja"
                value={formatMetricCount(metricsQuery.data.store.views)}
                icon={<Store className="size-4" />}
              />
              <MetricCard
                label="Cliques no WhatsApp"
                value={formatMetricCount(metricsQuery.data.store.whatsappClicks)}
                icon={<MessageCircle className="size-4" />}
              />
              <MetricCard
                label="Conversão da loja"
                value={formatConversionRate(
                  metricsQuery.data.store.conversionRate,
                )}
                description="Cliques WhatsApp ÷ visualizações"
                icon={<Percent className="size-4" />}
              />
            </MetricsGrid>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-h3">Anúncios</h3>
            <MetricsGrid aria-label="Métricas dos anúncios">
              <MetricCard
                label="Visualizações dos anúncios"
                value={formatMetricCount(metricsQuery.data.listings.views)}
                icon={<Eye className="size-4" />}
              />
              <MetricCard
                label="Cliques no WhatsApp"
                value={formatMetricCount(
                  metricsQuery.data.listings.whatsappClicks,
                )}
                icon={<MessageCircle className="size-4" />}
              />
              <MetricCard
                label="Conversão dos anúncios"
                value={formatConversionRate(
                  metricsQuery.data.listings.conversionRate,
                )}
                description="Cliques WhatsApp ÷ visualizações"
                icon={<Percent className="size-4" />}
              />
            </MetricsGrid>
          </div>

          {metricsQuery.data.bestListing ? (
            <div className="flex flex-col gap-3">
              <h3 className="text-h3">Destaque</h3>
              <BestListingCard listing={metricsQuery.data.bestListing} />
            </div>
          ) : null}

          {metricsQuery.data.topListings.length > 0 ? (
            <div className="flex flex-col gap-3">
              <h3 className="text-h3">Ranking de anúncios</h3>
              <TopListingsTable listings={metricsQuery.data.topListings} />
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

export { SellerMetricsSection };
export type { SellerMetricsSectionProps };
