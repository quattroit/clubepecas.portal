import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoader } from "@/components/feedback/PageLoader";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { StoresPageView } from "@/features/marketplace/components/StoresPageView";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export const metadata: Metadata = {
  title: "Lojas",
  description: "Conheça as lojas e vendedores do ClubePeças.",
  alternates: {
    canonical: `${SITE_URL}${ROUTES.STORES}`,
  },
  openGraph: {
    title: `Lojas | ${APP_NAME}`,
    description: "Conheça as lojas e vendedores do ClubePeças.",
    url: `${SITE_URL}${ROUTES.STORES}`,
    siteName: APP_NAME,
    locale: "pt_BR",
    type: "website",
  },
};

export default function StoresPage() {
  return (
    <Suspense fallback={<PageLoader label="Carregando lojas…" />}>
      <StoresPageView />
    </Suspense>
  );
}
