import type { Metadata } from "next";

import { APP_NAME } from "@/constants/app";
import { categoryPath } from "@/constants/routes";
import { CategoryDetailPageView } from "@/features/marketplace/components/CategoryDetailPageView";
import {
  getCategoryBySlug,
  listCategorySlugs,
} from "@/mappers/category.mapper";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: "Categoria não encontrada" };
  }

  const description =
    category.description ??
    `Veja anúncios da categoria ${category.name} no ClubePeças.`;
  const url = `${SITE_URL}${categoryPath(slug)}`;

  return {
    title: category.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${category.name} | ${APP_NAME}`,
      description,
      url,
      siteName: APP_NAME,
      locale: "pt_BR",
      type: "website",
    },
  };
}

export default function CategoryDetailPage() {
  return <CategoryDetailPageView />;
}
