import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

type AdminEmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/**
 * Empty state administrativo — wrapper do EmptyState do Design System.
 */
function AdminEmptyState({
  title,
  description,
  icon,
  action,
  className,
}: AdminEmptyStateProps) {
  return (
    <EmptyState
      data-slot="admin-empty-state"
      title={title}
      description={description}
      icon={icon}
      action={action}
      className={cn(className)}
    />
  );
}

export { AdminEmptyState };
export type { AdminEmptyStateProps };
