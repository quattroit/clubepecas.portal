import type { Metadata } from "next";

import { ROUTES } from "@/constants/routes";
import { SobrePageView } from "@/features/institutional";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sobre",
  description:
    "Conheça o ClubePeças: marketplace de peças automotivas para oficinas, autopeças e vendedores.",
  path: ROUTES.ABOUT,
});

export default function SobrePage() {
  return <SobrePageView />;
}
