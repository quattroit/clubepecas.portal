import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminSellersView } from "@/features/admin/components/AdminSellersView";

export const metadata: Metadata = {
  title: "Vendedores",
  description: "Gestão administrativa de vendedores do ClubePeças.",
  robots: { index: false, follow: false },
};

function SellersPageFallback() {
  return (
    <AdminPage
      title="Vendedores"
      description="Gerencie contas, status e desempenho dos vendedores."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Vendedores" },
      ]}
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={8} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminSellersPage() {
  return (
    <Suspense fallback={<SellersPageFallback />}>
      <AdminSellersView />
    </Suspense>
  );
}
