import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoader } from "@/components/feedback/PageLoader";
import { RepresentativeStatementView } from "@/features/representative/components/RepresentativeStatementView";

export const metadata: Metadata = {
  title: "Extrato",
  description: "Resumo mensal das suas comissões.",
  robots: { index: false, follow: false },
};

export default function RepresentativeStatementPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando extrato…" />}>
      <RepresentativeStatementView />
    </Suspense>
  );
}
