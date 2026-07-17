import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

/**
 * Card de indicador numérico — reutilizável no painel e futuros dashboards.
 */
function MetricCard({
  label,
  value,
  description,
  icon,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <CardTitle className="text-small text-muted-foreground font-medium">
          {label}
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
      <CardContent className="flex flex-col gap-1 pt-0">
        <p className="text-price-lg tabular-nums" aria-label={`${label}: ${value}`}>
          {value}
        </p>
        {description ? (
          <p className="text-muted-foreground text-xs">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { MetricCard };
export type { MetricCardProps };
