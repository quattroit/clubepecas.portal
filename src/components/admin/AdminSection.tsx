import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminSectionProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/**
 * Bloco padronizado de conteúdo administrativo.
 */
function AdminSection({
  title,
  description,
  actions,
  children,
  className,
}: AdminSectionProps) {
  return (
    <section
      data-slot="admin-section"
      className={cn("flex flex-col gap-4", className)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="text-h2">{title}</h2>
          {description ? (
            <p className="text-small text-muted-foreground max-w-2xl">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export { AdminSection };
export type { AdminSectionProps };
