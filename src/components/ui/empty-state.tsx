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
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="text-muted-foreground flex size-12 items-center justify-center [&_svg]:size-8">
          {icon}
        </div>
      ) : null}

      <div className="flex max-w-sm flex-col gap-1">
        <h3 className="text-h3">{title}</h3>
        {description ? <p className="text-small">{description}</p> : null}
      </div>

      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export { EmptyState };
export type { EmptyStateProps };
