import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminVehicleBrandsView } from "@/features/admin/components/AdminVehicleBrandsView";

export const metadata: Metadata = {
  title: "Marcas",
  description: "Gestão administrativa de marcas de veículo do ClubePeças.",
  robots: { index: false, follow: false },
};

function VehicleBrandsPageFallback() {
  return (
    <AdminPage
      title="Marcas"
      description="Gerencie as marcas de veículo disponíveis para anúncios e filtros do marketplace."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Marcas" },
      ]}
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={8} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminVehicleBrandsPage() {
  return (
    <Suspense fallback={<VehicleBrandsPageFallback />}>
      <AdminVehicleBrandsView />
    </Suspense>
  );
}
