import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminSubscriptionPlansView } from "@/features/admin/components/AdminSubscriptionPlansView";

export const metadata: Metadata = {
  title: "Planos",
  description: "Gestão administrativa de planos de assinatura do ClubePeças.",
  robots: { index: false, follow: false },
};

function PlansPageFallback() {
  return (
    <AdminPage
      title="Planos"
      description="Gerencie os planos de assinatura disponíveis na plataforma."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Planos" },
      ]}
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={6} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminPlansPage() {
  return (
    <Suspense fallback={<PlansPageFallback />}>
      <AdminSubscriptionPlansView />
    </Suspense>
  );
}
