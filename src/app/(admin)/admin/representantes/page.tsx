import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminRepresentativesView } from "@/features/admin/components/AdminRepresentativesView";

export const metadata: Metadata = {
  title: "Representantes",
  description: "Gestão administrativa de representantes comerciais.",
  robots: { index: false, follow: false },
};

function RepresentativesPageFallback() {
  return (
    <AdminPage
      title="Representantes"
      description="Cadastre e gerencie representantes comerciais da plataforma."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Representantes" },
      ]}
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={8} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminRepresentativesPage() {
  return (
    <Suspense fallback={<RepresentativesPageFallback />}>
      <AdminRepresentativesView />
    </Suspense>
  );
}
