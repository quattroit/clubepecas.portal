import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminPage,
  AdminSection,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminPaymentsView } from "@/features/admin/components/AdminPaymentsView";

export const metadata: Metadata = {
  title: "Pagamentos",
  description: "Gestão administrativa de pagamentos do ClubePeças.",
  robots: { index: false, follow: false },
};

function PaymentsPageFallback() {
  return (
    <AdminPage
      title="Pagamentos"
      description="Movimentações financeiras da plataforma."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Pagamentos" },
      ]}
    >
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={7} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<PaymentsPageFallback />}>
      <AdminPaymentsView />
    </Suspense>
  );
}
