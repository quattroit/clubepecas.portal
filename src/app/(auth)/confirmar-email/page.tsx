import type { Metadata } from "next";
import { Suspense } from "react";

import { ConfirmEmailView } from "@/components/auth/ConfirmEmailView";
import { PageLoader } from "@/components/feedback/PageLoader";

export const metadata: Metadata = {
  title: "Confirmar e-mail",
  description: "Confirme seu endereço de e-mail para acessar o ClubePeças.",
  robots: { index: false, follow: false },
};

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<PageLoader label="Confirmando e-mail…" />}>
      <ConfirmEmailView />
    </Suspense>
  );
}
