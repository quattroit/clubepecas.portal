import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminCommissionsView } from "@/features/admin/components/AdminCommissionsView";

export const metadata: Metadata = {
  title: "Comissões",
  description: "Gestão administrativa de comissões de representantes.",
  robots: { index: false, follow: false },
};

function CommissionsPageFallback() {
  return (
    <AdminPage
      title="Comissões"
      description="Comissões geradas automaticamente a partir de pagamentos elegíveis."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Comissões" },
      ]}
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={9} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminCommissionsPage() {
  return (
    <Suspense fallback={<CommissionsPageFallback />}>
      <AdminCommissionsView />
    </Suspense>
  );
}
