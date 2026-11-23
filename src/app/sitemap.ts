import type { MetadataRoute } from "next";

import { loadPublicSitemapEntries } from "@/lib/sitemap/load-public-sitemap";

/** Gerado a cada request. O build não consulta a API. */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    return await loadPublicSitemapEntries();
  } catch (error) {
    console.error(
      "[sitemap] Não foi possível gerar o sitemap completo.",
      error,
    );
    throw error;
  }
}
