import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminPage, AdminSection, AdminTableSkeleton } from "@/components/admin";
import { RepresentativePayoutsView } from "@/features/representative/components/RepresentativePayoutsView";

export const metadata: Metadata = {
  title: "Pagamentos",
  description: "Liquidações financeiras das suas comissões aprovadas.",
  robots: { index: false, follow: false },
};

function PayoutsPageFallback() {
  return (
    <AdminPage
      title="Pagamentos"
      description="Liquidações financeiras das suas comissões aprovadas."
    >
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={8} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function RepresentativePayoutsPage() {
  return (
    <Suspense fallback={<PayoutsPageFallback />}>
      <RepresentativePayoutsView />
    </Suspense>
  );
}
