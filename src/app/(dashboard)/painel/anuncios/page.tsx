import type { Metadata } from "next";

import { MyAdvertisementsView } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Meus anúncios",
  description: "Gerencie as peças que você anunciou na plataforma.",
  robots: { index: false, follow: false },
};

export default function MyAdvertisementsPage() {
  return <MyAdvertisementsView />;
}
