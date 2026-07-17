import type { PublicPlatformSettings } from "@/contracts/platform-settings";
import { APP_DESCRIPTION, APP_NAME } from "@/constants/app";
import { CONTACT_EMAIL, INSTAGRAM_URL } from "@/constants/contact";

const fallbackSettings: PublicPlatformSettings = {
  platformName: APP_NAME,
  platformDescription: APP_DESCRIPTION,
  supportEmail: CONTACT_EMAIL,
  supportPhone: null,
  whatsApp: null,
  instagram: INSTAGRAM_URL,
  facebook: null,
  youTube: null,
  tikTok: null,
  linkedIn: null,
  x: null,
  logoUrl: null,
  logoDarkUrl: null,
  faviconUrl: null,
  footerCopyright: null,
  defaultTitle: APP_NAME,
  defaultDescription: APP_DESCRIPTION,
  defaultKeywords: null,
};

/**
 * Busca as configurações públicas em servidor, com fallback seguro local.
 */
export async function getPublicPlatformSettings(): Promise<PublicPlatformSettings> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!apiUrl) return fallbackSettings;

  try {
    const response = await fetch(`${apiUrl}/api/v1/platform-settings`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return fallbackSettings;

    return { ...fallbackSettings, ...(await response.json()) };
  } catch {
    return fallbackSettings;
  }
}
