import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { PageLoader } from "@/components/feedback/PageLoader";

export const metadata: Metadata = {
  title: "Login",
  description: "Acesse sua conta no ClubePeças.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando…" />}>
      <LoginForm />
    </Suspense>
  );
}
