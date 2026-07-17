import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { PageLoader } from "@/components/feedback/PageLoader";

export const metadata: Metadata = {
  title: "Redefinir senha",
  description: "Defina uma nova senha para sua conta no ClubePeças.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando…" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
