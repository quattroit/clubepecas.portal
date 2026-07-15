import type { MetadataRoute } from "next";

/**
 * Regras de indexação — área autenticada e páginas utilitárias fora do SEO.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/painel/", "/login", "/cadastro", "/anunciar"],
    },
  };
}
