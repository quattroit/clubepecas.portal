import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminPage } from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminSettingsFormSkeleton } from "@/features/admin/components/AdminSettingsFormSkeleton";
import { AdminSettingsView } from "@/features/admin/components/AdminSettingsView";

export const metadata: Metadata = {
  title: "Configurações",
  description: "Configurações globais da plataforma ClubePeças.",
  robots: { index: false, follow: false },
};

function SettingsPageFallback() {
  return (
    <AdminPage
      title="Configurações"
      description="Gerencie informações institucionais, funcionalidades e limites da plataforma."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Configurações" },
      ]}
    >
      <AdminSettingsFormSkeleton />
    </AdminPage>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<SettingsPageFallback />}>
      <AdminSettingsView />
    </Suspense>
  );
}
