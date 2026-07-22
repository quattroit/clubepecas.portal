import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminFilterBar, AdminPage, AdminSection, AdminTableSkeleton } from "@/components/admin";
import { RepresentativeCommissionsView } from "@/features/representative/components/RepresentativeCommissionsView";

export const metadata: Metadata = {
  title: "Comissões",
  description: "Comissões geradas a partir das vendas dos seus vendedores.",
  robots: { index: false, follow: false },
};

function CommissionsPageFallback() {
  return (
    <AdminPage
      title="Comissões"
      description="Comissões geradas a partir das vendas dos seus vendedores vinculados."
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={7} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function RepresentativeCommissionsPage() {
  return (
    <Suspense fallback={<CommissionsPageFallback />}>
      <RepresentativeCommissionsView />
    </Suspense>
  );
}
