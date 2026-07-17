import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/**
 * Estado vazio reutilizável — sem regra de negócio.
 */
function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "bg-muted/40 border-border flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-6 py-14 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="bg-secondary text-muted-foreground flex size-14 items-center justify-center rounded-xl [&_svg]:size-7">
          {icon}
        </div>
      ) : null}

      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="text-h3">{title}</h3>
        {description ? (
          <p className="text-small text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}

export { EmptyState };
export type { EmptyStateProps };
