import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type AdminBreadcrumbItem = {
  label: string;
  href?: string;
};

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  breadcrumb?: AdminBreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
};

/**
 * Cabeçalho padronizado de páginas administrativas.
 */
function AdminPageHeader({
  title,
  description,
  breadcrumb,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <header
      data-slot="admin-page-header"
      className={cn("flex flex-col gap-3", className)}
    >
      {breadcrumb && breadcrumb.length > 0 ? (
        <nav aria-label="Breadcrumb">
          <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;
              return (
                <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 ? (
                    <span aria-hidden className="opacity-50">
                      /
                    </span>
                  ) : null}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="hover:text-foreground focus-visible:ring-ring rounded-sm underline-offset-4 hover:underline outline-none focus-visible:ring-2"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(isLast && "text-foreground font-medium")}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <h1 className="text-h1">{title}</h1>
          {description ? (
            <p className="text-body text-muted-foreground max-w-2xl">
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
    </header>
  );
}

export { AdminPageHeader };
export type { AdminPageHeaderProps, AdminBreadcrumbItem };
