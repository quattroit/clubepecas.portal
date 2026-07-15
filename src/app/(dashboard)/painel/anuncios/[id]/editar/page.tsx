import type { Metadata } from "next";

import { EditAdvertisementView } from "@/features/dashboard/components/EditAdvertisementView";

export const metadata: Metadata = {
  title: "Editar anúncio",
  description: "Edite os dados do seu anúncio no ClubePeças.",
  robots: { index: false, follow: false },
};

export default function EditAdvertisementPage() {
  return <EditAdvertisementView />;
}
