import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminPayoutsView } from "@/features/admin/components/AdminPayoutsView";

export const metadata: Metadata = {
  title: "Pagamentos de comissões",
  description: "Gestão administrativa de pagamentos de comissões de representantes.",
  robots: { index: false, follow: false },
};

function PayoutsPageFallback() {
  return (
    <AdminPage
      title="Pagamentos de comissões"
      description="Liquidações financeiras das comissões aprovadas de representantes."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Pagamentos de comissões" },
      ]}
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={10} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminPayoutsPage() {
  return (
    <Suspense fallback={<PayoutsPageFallback />}>
      <AdminPayoutsView />
    </Suspense>
  );
}
