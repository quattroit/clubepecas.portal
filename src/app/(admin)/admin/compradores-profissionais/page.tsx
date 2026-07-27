import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminProfessionalBuyersView } from "@/features/admin/components/AdminProfessionalBuyersView";

export const metadata: Metadata = {
  title: "Compradores Profissionais",
  description: "Gestão administrativa de compradores profissionais.",
  robots: { index: false, follow: false },
};

function ProfessionalBuyersPageFallback() {
  return (
    <AdminPage
      title="Compradores Profissionais"
      description="Cadastre e gerencie compradores profissionais da plataforma."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Compradores Profissionais" },
      ]}
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={8} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminProfessionalBuyersPage() {
  return (
    <Suspense fallback={<ProfessionalBuyersPageFallback />}>
      <AdminProfessionalBuyersView />
    </Suspense>
  );
}
