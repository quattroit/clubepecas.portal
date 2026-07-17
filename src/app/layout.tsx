import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { Providers } from "@/components/providers";
import {
  APP_DESCRIPTION,
  APP_LOGO_HEIGHT,
  APP_LOGO_SRC,
  APP_LOGO_WIDTH,
  APP_NAME,
} from "@/constants/app";
import { getPublicPlatformSettings } from "@/lib/platform-settings";
import "@/styles/globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicPlatformSettings();
  const name = settings.platformName ?? APP_NAME;
  const description = settings.defaultDescription ?? settings.platformDescription ?? APP_DESCRIPTION;
  const logo = settings.logoUrl ?? APP_LOGO_SRC;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: settings.defaultTitle ?? name, template: `%s | ${name}` },
    description,
    keywords: settings.defaultKeywords ?? undefined,
    icons: { icon: settings.faviconUrl ?? APP_LOGO_SRC, apple: settings.faviconUrl ?? APP_LOGO_SRC },
    openGraph: {
      siteName: name,
      locale: "pt_BR",
      type: "website",
      images: [{ url: logo, width: APP_LOGO_WIDTH, height: APP_LOGO_HEIGHT, alt: name }],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#conteudo-principal"
          className="bg-primary text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:ring-2 focus:outline-none"
        >
          Ir para o conteúdo
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
