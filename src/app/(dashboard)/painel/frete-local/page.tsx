import type { Metadata } from "next";

import { SellerLocalDeliveryView } from "@/features/dashboard/components/SellerLocalDeliveryView";

export const metadata: Metadata = {
  title: "Frete Local",
  description:
    "Configure entrega local com motoboy ou veículo próprio no ClubePeças.",
  robots: { index: false, follow: false },
};

export default function LocalDeliveryPage() {
  return <SellerLocalDeliveryView />;
}
