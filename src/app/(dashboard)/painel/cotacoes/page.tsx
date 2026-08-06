import type { Metadata } from "next";

import { SellerQuotationsListView } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Central de Cotações",
  description: "Solicitações de cotação recebidas de compradores profissionais.",
  robots: { index: false, follow: false },
};

export default function SellerQuotationsPage() {
  return <SellerQuotationsListView />;
}
