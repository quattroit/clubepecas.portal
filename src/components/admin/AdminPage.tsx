import type { ReactNode } from "react";

import {
  AdminPageHeader,
  type AdminBreadcrumbItem,
} from "@/components/admin/AdminPageHeader";
import { cn } from "@/lib/utils";

type AdminPageProps = {
  title: string;
  description?: string;
  breadcrumb?: AdminBreadcrumbItem[];
  children?: ReactNode;
  className?: string;
  actions?: ReactNode;
};

/**
 * Página administrativa — cabeçalho + conteúdo padronizados.
 */
function AdminPage({
  title,
  description,
  breadcrumb,
  children,
  className,
  actions,
}: AdminPageProps) {
  return (
    <div
      data-slot="admin-page"
      className={cn("flex flex-col gap-6", className)}
    >
      <AdminPageHeader
        title={title}
        description={description}
        breadcrumb={breadcrumb}
        actions={actions}
      />
      {children}
    </div>
  );
}

export { AdminPage };
export type { AdminPageProps };
