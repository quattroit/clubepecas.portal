import type { Metadata } from "next";

import { ROUTES } from "@/constants/routes";
import { ContatoPageView } from "@/features/institutional";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contato",
  description:
    "Fale com a equipe do ClubePeças. Tire dúvidas sobre a plataforma, suporte e assuntos comerciais.",
  path: ROUTES.CONTACT,
});

export default function ContatoPage() {
  return <ContatoPageView />;
}
