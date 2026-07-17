import { Suspense } from "react";

import type { Metadata } from "next";

import { PageLoader } from "@/components/feedback/PageLoader";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { AdvertisementsPageView } from "@/features/marketplace/components/AdvertisementsPageView";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

const PAGE_TITLE = "Anúncios de Peças Automotivas";
const PAGE_DESCRIPTION =
  "Veja anúncios de peças automotivas no ClubePeças. Filtre por categoria, localização e preço.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}${ROUTES.ADVERTISEMENTS}`,
  },
  openGraph: {
    title: `${PAGE_TITLE} | ${APP_NAME}`,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}${ROUTES.ADVERTISEMENTS}`,
    siteName: APP_NAME,
    locale: "pt_BR",
    type: "website",
  },
};

export default function AdvertisementsPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando anúncios…" />}>
      <AdvertisementsPageView />
    </Suspense>
  );
}
