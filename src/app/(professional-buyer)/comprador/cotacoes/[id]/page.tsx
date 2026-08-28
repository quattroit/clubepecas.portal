import type { Metadata } from "next";

import { QuotationDetailView } from "@/features/professional-buyer";

export const metadata: Metadata = {
  title: "Detalhe da cotação",
  description: "Detalhe da solicitação de cotação enviada.",
  robots: { index: false, follow: false },
};

export default function BuyerQuotationDetailPage() {
  return <QuotationDetailView />;
}
