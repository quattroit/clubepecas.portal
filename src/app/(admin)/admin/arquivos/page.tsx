import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { AdminPage } from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Arquivos",
  description: "Manutenção e integridade do armazenamento de arquivos.",
  robots: { index: false, follow: false },
};

const AdminFilesView = dynamic(
  () =>
    import("@/features/admin/components/AdminFilesView").then((mod) => ({
      default: mod.AdminFilesView,
    })),
  {
    loading: () => (
      <AdminPage
        title="Arquivos"
        description="Verifique a consistência do armazenamento e remova arquivos órfãos com segurança."
        breadcrumb={[
          { label: "Admin", href: ROUTES.ADMIN },
          { label: "Arquivos" },
        ]}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      </AdminPage>
    ),
  },
);

export default function AdminFilesPage() {
  return <AdminFilesView />;
}
