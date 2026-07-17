import type { Metadata } from "next";
import { CreditCard } from "lucide-react";

import { AdminEmptyState, AdminPage, AdminSection } from "@/components/admin";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Planos",
  robots: { index: false, follow: false },
};

export default function AdminPlansPage() {
  return (
    <AdminPage
      title="Planos"
      description="Gestão de planos — disponível na Sprint 4.3.5."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Planos" },
      ]}
    >
      <AdminSection title="Catálogo">
        <AdminEmptyState
          title="Sem planos"
          description="O catálogo de planos será implementado na Sprint 4.3.5."
          icon={<CreditCard aria-hidden />}
        />
      </AdminSection>
    </AdminPage>
  );
}
