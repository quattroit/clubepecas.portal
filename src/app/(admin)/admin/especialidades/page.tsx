import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminSpecialtiesView } from "@/features/admin/components/AdminSpecialtiesView";

export const metadata: Metadata = {
  title: "Especialidades",
  description: "Gestão administrativa de especialidades de vendedor do ClubePeças.",
  robots: { index: false, follow: false },
};

function SpecialtiesPageFallback() {
  return (
    <AdminPage
      title="Especialidades"
      description="Gerencie as especialidades que os vendedores podem selecionar no perfil (até 3)."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Especialidades" },
      ]}
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={6} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminSpecialtiesPage() {
  return (
    <Suspense fallback={<SpecialtiesPageFallback />}>
      <AdminSpecialtiesView />
    </Suspense>
  );
}
