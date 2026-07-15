import type { Metadata } from "next";

import { ROUTES } from "@/constants/routes";
import { PrivacidadePageView } from "@/features/institutional";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacidade",
  description:
    "Política de Privacidade do ClubePeças: como tratamos dados pessoais, cookies, segurança e direitos do titular (LGPD).",
  path: ROUTES.PRIVACY,
});

export default function PrivacidadePage() {
  return <PrivacidadePageView />;
}
