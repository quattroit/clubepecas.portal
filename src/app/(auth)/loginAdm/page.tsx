import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { PageLoader } from "@/components/feedback/PageLoader";

export const metadata: Metadata = {
  title: "Login administrativo",
  description: "Acesso restrito ao painel administrativo do ClubePeças.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando…" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
