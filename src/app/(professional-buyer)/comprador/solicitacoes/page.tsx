import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoader } from "@/components/feedback/PageLoader";
import { PartRequestsListView } from "@/features/professional-buyer";

export const metadata: Metadata = {
  title: "Solicitações",
  description: "Suas solicitações de peças no ClubePeças.",
  robots: { index: false, follow: false },
};

export default function PartRequestsPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando solicitações…" />}>
      <PartRequestsListView />
    </Suspense>
  );
}
