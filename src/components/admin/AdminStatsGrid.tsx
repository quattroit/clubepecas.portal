import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminStatsGridProps = {
  children: ReactNode;
  className?: string;
  /** Rótulo acessível do grupo de métricas. */
  "aria-label"?: string;
};

/**
 * Grid responsivo para AdminMetricCard — quantidade flexível.
 */
function AdminStatsGrid({
  children,
  className,
  "aria-label": ariaLabel = "Indicadores",
}: AdminStatsGridProps) {
  return (
    <div
      data-slot="admin-stats-grid"
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { AdminStatsGrid };
export type { AdminStatsGridProps };
