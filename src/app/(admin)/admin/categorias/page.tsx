import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminCategoriesView } from "@/features/admin/components/AdminCategoriesView";

export const metadata: Metadata = {
  title: "Categorias",
  description: "Gestão administrativa de categorias do ClubePeças.",
  robots: { index: false, follow: false },
};

function CategoriesPageFallback() {
  return (
    <AdminPage
      title="Categorias"
      description="Gerencie as categorias do catálogo público do marketplace."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Categorias" },
      ]}
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={7} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<CategoriesPageFallback />}>
      <AdminCategoriesView />
    </Suspense>
  );
}
