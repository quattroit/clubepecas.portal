import type { MetadataRoute } from "next";

import { SITEMAP_URL } from "@/lib/sitemap/constants";

/**
 * Rastreamento aberto. A exclusão de áreas privadas fica na metadata robots.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: SITEMAP_URL,
  };
}
