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
import { AdminSellerDetailView } from "@/features/admin/components/AdminSellerDetailView";

export const metadata: Metadata = {
  title: "Detalhes do vendedor",
  robots: { index: false, follow: false },
};

function SellerDetailFallback() {
  return (
    <AdminPage
      title="Vendedor"
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Vendedores", href: ROUTES.ADMIN_SELLERS },
        { label: "Detalhes" },
      ]}
    >
      <AdminSection title="Indicadores">
        <AdminStatsGrid>
          <AdminMetricCardSkeleton />
          <AdminMetricCardSkeleton />
          <AdminMetricCardSkeleton />
          <AdminMetricCardSkeleton />
        </AdminStatsGrid>
      </AdminSection>
      <AdminSection title="Anúncios">
        <AdminTableSkeleton columns={8} rows={5} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminSellerDetailPage() {
  return (
    <Suspense fallback={<SellerDetailFallback />}>
      <AdminSellerDetailView />
    </Suspense>
  );
}
