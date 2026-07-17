import type { Metadata } from "next";

import { AdminFilesView } from "@/features/admin/components/AdminFilesView";

export const metadata: Metadata = {
  title: "Arquivos",
  description: "Manutenção e integridade do armazenamento de arquivos.",
  robots: { index: false, follow: false },
};

export default function AdminFilesPage() {
  return <AdminFilesView />;
}
