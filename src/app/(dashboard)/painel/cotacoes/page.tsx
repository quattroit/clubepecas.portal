import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoader } from "@/components/feedback/PageLoader";
import { SellerQuotationsListView } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Central de Cotações",
  description: "Solicitações de cotação recebidas de compradores profissionais.",
  robots: { index: false, follow: false },
};

export default function SellerQuotationsPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando cotações…" />}>
      <SellerQuotationsListView />
    </Suspense>
  );
}
