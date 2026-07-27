import type { Metadata } from "next";

import { EditPartRequestView } from "@/features/professional-buyer";

export const metadata: Metadata = {
  title: "Editar solicitação",
  description: "Edite uma solicitação de peças no ClubePeças.",
  robots: { index: false, follow: false },
};

export default function EditPartRequestPage() {
  return <EditPartRequestView />;
}
