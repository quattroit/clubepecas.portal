import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminAdvertisementsView } from "@/features/admin/components/AdminAdvertisementsView";

export const metadata: Metadata = {
  title: "Anúncios",
  description: "Gestão administrativa de anúncios do ClubePeças.",
  robots: { index: false, follow: false },
};

function AdvertisementsPageFallback() {
  return (
    <AdminPage
      title="Anúncios"
      description="Localize, acompanhe métricas e controle a disponibilidade dos anúncios."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Anúncios" },
      ]}
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={8} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminAdvertisementsPage() {
  return (
    <Suspense fallback={<AdvertisementsPageFallback />}>
      <AdminAdvertisementsView />
    </Suspense>
  );
}
