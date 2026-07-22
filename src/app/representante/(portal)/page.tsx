import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoader } from "@/components/feedback/PageLoader";
import { RepresentativeDashboardView } from "@/features/representative/components/RepresentativeDashboardView";

export const metadata: Metadata = {
  title: "Dashboard do Representante",
  description: "Resumo de comissões, vendedores e desempenho de indicação.",
  robots: { index: false, follow: false },
};

export default function RepresentativeDashboardPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando dashboard…" />}>
      <RepresentativeDashboardView />
    </Suspense>
  );
}
