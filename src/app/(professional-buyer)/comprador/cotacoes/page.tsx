import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoader } from "@/components/feedback/PageLoader";
import { QuotationsHistoryListView } from "@/features/professional-buyer";

export const metadata: Metadata = {
  title: "Cotações enviadas",
  description: "Histórico de cotações enviadas aos vendedores.",
  robots: { index: false, follow: false },
};

export default function QuotationsHistoryPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando cotações…" />}>
      <QuotationsHistoryListView />
    </Suspense>
  );
}
