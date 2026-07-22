import type { Metadata } from "next";
import { Suspense } from "react";

import { RepresentativeLoginForm } from "@/components/auth/RepresentativeLoginForm";
import { PageLoader } from "@/components/feedback/PageLoader";

export const metadata: Metadata = {
  title: "Login do Representante",
  description: "Acesse o portal do representante comercial ClubePeças.",
  robots: { index: false, follow: false },
};

export default function RepresentativeLoginPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando…" />}>
      <RepresentativeLoginForm />
    </Suspense>
  );
}
