import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type AdminMetricTrend = "up" | "down" | "neutral";

type AdminMetricCardProps = {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  /** Variação percentual formatada (ex.: "+12%"). */
  change?: string;
  trend?: AdminMetricTrend;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
};

/**
 * Card de indicador KPI — preparado para gráficos futuros.
 */
function AdminMetricCard({
  title,
  value,
  description,
  icon,
  change,
  trend = "neutral",
  loading = false,
  onClick,
  className,
}: AdminMetricCardProps) {
  const interactive = Boolean(onClick);
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;

  if (loading) {
    return (
      <Card className={cn("h-full", className)} aria-busy>
        <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="size-9 rounded-lg" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pt-0">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-28" />
        </CardContent>
      </Card>
    );
  }

  const content = (
    <>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <CardTitle className="text-small text-muted-foreground font-medium">
          {title}
        </CardTitle>
        {icon ? (
          <div
            className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg"
            aria-hidden
          >
            {icon}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5 pt-0">
        <p
          className="text-price-lg tabular-nums"
          aria-label={`${title}: ${value}`}
        >
          {value}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {change ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium tabular-nums",
                trend === "up" && "text-emerald-600 dark:text-emerald-400",
                trend === "down" && "text-destructive",
                trend === "neutral" && "text-muted-foreground",
              )}
            >
              {TrendIcon ? (
                <TrendIcon className="size-3.5" aria-hidden />
              ) : null}
              {change}
            </span>
          ) : null}
          {description ? (
            <p className="text-muted-foreground text-xs">{description}</p>
          ) : null}
        </div>
        {/* Slot reservado para gráficos futuros */}
        <div data-slot="admin-metric-chart" className="hidden" aria-hidden />
      </CardContent>
    </>
  );

  if (interactive) {
    return (
      <Card
        data-slot="admin-metric-card"
        className={cn(
          "card-interactive h-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick?.();
          }
        }}
      >
        {content}
      </Card>
    );
  }

  return (
    <Card data-slot="admin-metric-card" className={cn("h-full", className)}>
      {content}
    </Card>
  );
}

export { AdminMetricCard };
export type { AdminMetricCardProps, AdminMetricTrend };
