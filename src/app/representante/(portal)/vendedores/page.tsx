import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminFilterBar, AdminPage, AdminSection, AdminTableSkeleton } from "@/components/admin";
import { RepresentativeSellersView } from "@/features/representative/components/RepresentativeSellersView";

export const metadata: Metadata = {
  title: "Vendedores",
  description: "Vendedores vinculados à sua indicação.",
  robots: { index: false, follow: false },
};

function SellersPageFallback() {
  return (
    <AdminPage
      title="Vendedores"
      description="Vendedores vinculados à sua indicação."
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={7} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function RepresentativeSellersPage() {
  return (
    <Suspense fallback={<SellersPageFallback />}>
      <RepresentativeSellersView />
    </Suspense>
  );
}
