import type { Metadata } from "next";

import { APP_NAME } from "@/constants/app";

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  siteName?: string;
};

/**
 * Metadata padrão das páginas públicas (title, description, canonical, OG, Twitter).
 */
export function buildPageMetadata({
  title,
  description,
  path,
  siteName = APP_NAME,
}: PageMetadataInput): Metadata {
  const url = `${getSiteUrl()}${path}`;
  const ogTitle = `${title} | ${siteName}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName,
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}
