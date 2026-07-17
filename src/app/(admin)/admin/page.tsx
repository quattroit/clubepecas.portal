import type { Metadata } from "next";

import { AdminDashboardView } from "@/features/admin";

export const metadata: Metadata = {
  title: "Painel Administrativo",
  description: "Visão consolidada do marketplace ClubePeças.",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}
