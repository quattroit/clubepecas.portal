import type { Metadata } from "next";

import { ROUTES } from "@/constants/routes";
import { ContatoPageView } from "@/features/institutional";
import { getPublicPlatformSettings } from "@/lib/platform-settings";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicPlatformSettings();

  return buildPageMetadata({
    title: "Contato",
    description:
      settings.defaultDescription ??
      `Fale com a equipe do ${settings.platformName ?? "ClubePeças"}. Tire dúvidas sobre a plataforma, suporte e assuntos comerciais.`,
    path: ROUTES.CONTACT,
    siteName: settings.platformName ?? undefined,
  });
}

export default async function ContatoPage() {
  const settings = await getPublicPlatformSettings();

  return (
    <ContatoPageView
      email={settings.supportEmail ?? undefined}
      phone={settings.supportPhone ?? undefined}
      whatsApp={settings.whatsApp ?? undefined}
      platformName={settings.platformName ?? undefined}
    />
  );
}
