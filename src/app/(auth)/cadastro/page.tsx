import type { Metadata } from "next";
import { Suspense } from "react";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { PageLoader } from "@/components/feedback/PageLoader";

export const metadata: Metadata = {
  title: "Cadastro",
  description: "Crie sua conta no ClubePeças.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando…" />}>
      <RegisterForm />
    </Suspense>
  );
}
