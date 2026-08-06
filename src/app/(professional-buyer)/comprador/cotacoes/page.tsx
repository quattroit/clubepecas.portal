import type { Metadata } from "next";

import { QuotationsHistoryListView } from "@/features/professional-buyer";

export const metadata: Metadata = {
  title: "Cotações enviadas",
  description: "Histórico de cotações enviadas aos vendedores.",
  robots: { index: false, follow: false },
};

export default function QuotationsHistoryPage() {
  return <QuotationsHistoryListView />;
}
