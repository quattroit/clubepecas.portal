import type { Metadata } from "next";

import { PartRequestDetailView } from "@/features/professional-buyer";

export const metadata: Metadata = {
  title: "Detalhe da solicitação",
  description: "Detalhes da solicitação de peças no ClubePeças.",
  robots: { index: false, follow: false },
};

export default function PartRequestDetailPage() {
  return <PartRequestDetailView />;
}
