import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminMetricCardSkeleton,
  AdminPage,
  AdminSection,
  AdminStatsGrid,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminFinancialDashboardView } from "@/features/admin/components/AdminFinancialDashboardView";

export const metadata: Metadata = {
  title: "Financeiro",
  description: "Dashboard financeiro administrativo do ClubePeças.",
  robots: { index: false, follow: false },
};

function FinancialPageFallback() {
  return (
    <AdminPage
      title="Financeiro"
      description="Indicadores de receita, assinaturas e cobranças."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Financeiro" },
      ]}
    >
      <AdminSection title="Receita recorrente">
        <AdminStatsGrid>
          <AdminMetricCardSkeleton />
          <AdminMetricCardSkeleton />
          <AdminMetricCardSkeleton />
          <AdminMetricCardSkeleton />
        </AdminStatsGrid>
      </AdminSection>
      <AdminSection title="Receita por plano">
        <AdminTableSkeleton columns={4} rows={4} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminFinancialPage() {
  return (
    <Suspense fallback={<FinancialPageFallback />}>
      <AdminFinancialDashboardView />
    </Suspense>
  );
}
