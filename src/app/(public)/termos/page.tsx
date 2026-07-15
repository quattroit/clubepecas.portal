import type { Metadata } from "next";

import { ROUTES } from "@/constants/routes";
import { TermosPageView } from "@/features/institutional";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Termos de Uso",
  description:
    "Leia os Termos de Uso do ClubePeças: regras de cadastro, anúncios, condutas e responsabilidades no marketplace.",
  path: ROUTES.TERMS,
});

export default function TermosPage() {
  return <TermosPageView />;
}
