import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoader } from "@/components/feedback/PageLoader";
import { RepresentativeLinkView } from "@/features/representative/components/RepresentativeLinkView";

export const metadata: Metadata = {
  title: "Link de indicação",
  description: "Compartilhe seu link público de indicação de vendedores.",
  robots: { index: false, follow: false },
};

export default function RepresentativeLinkPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando link…" />}>
      <RepresentativeLinkView />
    </Suspense>
  );
}
