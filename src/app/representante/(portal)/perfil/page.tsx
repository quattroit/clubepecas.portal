import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoader } from "@/components/feedback/PageLoader";
import { RepresentativeProfileView } from "@/features/representative/components/RepresentativeProfileView";

export const metadata: Metadata = {
  title: "Meu perfil",
  description: "Gerencie seus dados de contato e endereço de representante.",
  robots: { index: false, follow: false },
};

export default function RepresentativeProfilePage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando perfil…" />}>
      <RepresentativeProfileView />
    </Suspense>
  );
}
