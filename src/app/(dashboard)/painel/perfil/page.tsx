import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoader } from "@/components/feedback/PageLoader";
import { SellerProfileView } from "@/features/dashboard/components/SellerProfileView";

export const metadata: Metadata = {
  title: "Meu perfil",
  description: "Gerencie o perfil da sua loja no ClubePeças.",
  robots: { index: false, follow: false },
};

export default function SellerProfilePage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando perfil…" />}>
      <SellerProfileView />
    </Suspense>
  );
}
