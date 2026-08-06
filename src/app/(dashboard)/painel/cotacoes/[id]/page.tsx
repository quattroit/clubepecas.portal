import type { Metadata } from "next";

import { SellerQuotationDetailView } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Detalhe da cotação",
  description: "Detalhe da solicitação de cotação recebida.",
  robots: { index: false, follow: false },
};

export default function SellerQuotationDetailPage() {
  return <SellerQuotationDetailView />;
}
