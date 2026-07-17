import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoader } from "@/components/feedback/PageLoader";
import { MyPlanView } from "@/features/dashboard/components/MyPlanView";

export const metadata: Metadata = {
  title: "Meu plano",
  description: "Gerencie o plano de assinatura da sua loja no ClubePeças.",
  robots: { index: false, follow: false },
};

export default function MyPlanPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando plano…" />}>
      <MyPlanView />
    </Suspense>
  );
}
