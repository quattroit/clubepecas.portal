import type { Metadata } from "next";

import { QuotationDraftView } from "@/features/professional-buyer";

export const metadata: Metadata = {
  title: "Minha Cotação",
  description: "Monte e envie sua solicitação de cotação aos vendedores.",
  robots: { index: false, follow: false },
};

export default function QuotationDraftPage() {
  return <QuotationDraftView />;
}
