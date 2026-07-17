import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminFilterBar,
  AdminPage,
  AdminSection,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminAuditView } from "@/features/admin/components/AdminAuditView";

export const metadata: Metadata = {
  title: "Auditoria",
  description: "Histórico de auditoria administrativa do ClubePeças.",
  robots: { index: false, follow: false },
};

function AuditPageFallback() {
  return (
    <AdminPage
      title="Auditoria"
      description="Consulte o histórico de ações administrativas e eventos de segurança."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Auditoria" },
      ]}
    >
      <AdminFilterBar />
      <AdminSection title="Listagem">
        <AdminTableSkeleton columns={6} rows={8} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminAuditPage() {
  return (
    <Suspense fallback={<AuditPageFallback />}>
      <AdminAuditView />
    </Suspense>
  );
}
