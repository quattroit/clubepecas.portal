import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MetricsGridProps = {
  children: ReactNode;
  className?: string;
  /** Rótulo acessível do grupo de métricas. */
  "aria-label"?: string;
};

/**
 * Grid responsivo para cards de métricas.
 */
function MetricsGrid({
  children,
  className,
  "aria-label": ariaLabel,
}: MetricsGridProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { MetricsGrid };
export type { MetricsGridProps };
