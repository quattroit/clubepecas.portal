import type { Metadata } from "next";

import { APP_DESCRIPTION, APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { PlansPageView } from "@/features/plans";
import { buildPageMetadata, getSiteUrl } from "@/lib/seo";

const PAGE_DESCRIPTION =
  "Conheça os planos do ClubePeças e escolha a melhor opção para anunciar suas peças automotivas.";

export const metadata: Metadata = buildPageMetadata({
  title: "Planos",
  description: PAGE_DESCRIPTION,
  path: ROUTES.PLANS,
});

function PlansJsonLd() {
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: APP_NAME,
    description: APP_DESCRIPTION,
    url: `${siteUrl}${ROUTES.PLANS}`,
    provider: {
      "@type": "Organization",
      name: APP_NAME,
      url: siteUrl,
    },
    areaServed: "BR",
    serviceType: "Marketplace de peças automotivas",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function PlansPage() {
  return (
    <>
      <PlansJsonLd />
      <PlansPageView />
    </>
  );
}
