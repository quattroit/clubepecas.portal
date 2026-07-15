import type { Metadata } from "next";

import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { CategoriesPageView } from "@/features/marketplace/components/CategoriesPageView";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

const PAGE_TITLE = "Categorias de Peças Automotivas";
const PAGE_DESCRIPTION =
  "Encontre rapidamente peças automotivas navegando por categoria.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}${ROUTES.CATEGORIES}`,
  },
  openGraph: {
    title: `${PAGE_TITLE} | ${APP_NAME}`,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}${ROUTES.CATEGORIES}`,
    siteName: APP_NAME,
    locale: "pt_BR",
    type: "website",
  },
};

export default function CategoriesPage() {
  return <CategoriesPageView />;
}
