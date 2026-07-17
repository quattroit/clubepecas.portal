import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminVehicleModelsView } from "@/features/admin/components/AdminVehicleModelsView";

export const metadata: Metadata = {
  title: "Modelos",
  description: "Gestão administrativa de modelos de veículo do ClubePeças.",
  robots: { index: false, follow: false },
};

function VehicleModelsPageFallback() {
  return (
    <AdminPage
      title="Modelos"
      description="Gerencie os modelos de veículo disponíveis para anúncios e filtros do marketplace."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Modelos" },
      ]}
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={9} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminVehicleModelsPage() {
  return (
    <Suspense fallback={<VehicleModelsPageFallback />}>
      <AdminVehicleModelsView />
    </Suspense>
  );
}
