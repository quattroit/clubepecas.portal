import type { Metadata } from "next";
import { Suspense } from "react";

import { RepresentativeResetPasswordForm } from "@/components/auth/RepresentativeResetPasswordForm";
import { PageLoader } from "@/components/feedback/PageLoader";

export const metadata: Metadata = {
  title: "Redefinir senha — Representante",
  description: "Defina uma nova senha para sua conta de representante ClubePeças.",
  robots: { index: false, follow: false },
};

export default function RepresentativeResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando…" />}>
      <RepresentativeResetPasswordForm />
    </Suspense>
  );
}
