import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminCitiesView } from "@/features/admin/components/AdminCitiesView";

export const metadata: Metadata = {
  title: "Cidades",
  description: "Gestão administrativa de cidades do ClubePeças.",
  robots: { index: false, follow: false },
};

function CitiesPageFallback() {
  return (
    <AdminPage
      title="Cidades"
      description="Gerencie as cidades disponíveis para vendedores e filtros do marketplace."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Cidades" },
      ]}
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={8} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminCitiesPage() {
  return (
    <Suspense fallback={<CitiesPageFallback />}>
      <AdminCitiesView />
    </Suspense>
  );
}
