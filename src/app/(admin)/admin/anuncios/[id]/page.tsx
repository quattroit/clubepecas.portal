import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminMetricCardSkeleton,
  AdminPage,
  AdminSection,
  AdminStatsGrid,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminAdvertisementDetailView } from "@/features/admin/components/AdminAdvertisementDetailView";

export const metadata: Metadata = {
  title: "Detalhes do anúncio",
  robots: { index: false, follow: false },
};

function AdvertisementDetailFallback() {
  return (
    <AdminPage
      title="Anúncio"
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Anúncios", href: ROUTES.ADMIN_ADVERTISEMENTS },
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
    </AdminPage>
  );
}

export default function AdminAdvertisementDetailPage() {
  return (
    <Suspense fallback={<AdvertisementDetailFallback />}>
      <AdminAdvertisementDetailView />
    </Suspense>
  );
}
