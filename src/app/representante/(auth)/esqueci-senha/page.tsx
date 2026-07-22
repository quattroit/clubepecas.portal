import type { Metadata } from "next";

import { RepresentativeForgotPasswordForm } from "@/components/auth/RepresentativeForgotPasswordForm";

export const metadata: Metadata = {
  title: "Esqueci minha senha — Representante",
  description: "Recupere o acesso ao portal do representante ClubePeças.",
  robots: { index: false, follow: false },
};

export default function RepresentativeForgotPasswordPage() {
  return <RepresentativeForgotPasswordForm />;
}
