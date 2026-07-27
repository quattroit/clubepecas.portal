import type { Metadata } from "next";

import { ProfessionalBuyerDashboardView } from "@/features/professional-buyer";

export const metadata: Metadata = {
  title: "Comprador profissional",
  description: "Área do comprador profissional no ClubePeças.",
  robots: { index: false, follow: false },
};

export default function ProfessionalBuyerDashboardPage() {
  return <ProfessionalBuyerDashboardView />;
}
