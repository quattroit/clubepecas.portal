import type { Metadata } from "next";

import { NewAdvertisementView } from "@/features/dashboard/components/NewAdvertisementView";

export const metadata: Metadata = {
  title: "Nova peça",
  description: "Publique um novo anúncio no ClubePeças.",
  robots: { index: false, follow: false },
};

export default function NewAdvertisementPage() {
  return <NewAdvertisementView />;
}
