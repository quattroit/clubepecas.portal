import type { Metadata } from "next";

import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { HomePageView } from "@/features/marketplace/components/HomePageView";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

const HOME_TITLE = "Marketplace de Peças Automotivas";
const HOME_DESCRIPTION =
  "Encontre e anuncie peças automotivas com confiança. Oficinas, autopeças e compradores em um só lugar.";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}${ROUTES.HOME}`,
  },
  openGraph: {
    title: `${HOME_TITLE} | ${APP_NAME}`,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    siteName: APP_NAME,
    locale: "pt_BR",
    type: "website",
  },
};

export default function HomePage() {
  return <HomePageView />;
}
