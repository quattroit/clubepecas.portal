import type { Metadata } from "next";

import { NewPartRequestView } from "@/features/professional-buyer";

export const metadata: Metadata = {
  title: "Nova solicitação",
  description: "Crie uma nova solicitação de peças no ClubePeças.",
  robots: { index: false, follow: false },
};

export default function NewPartRequestPage() {
  return <NewPartRequestView />;
}
