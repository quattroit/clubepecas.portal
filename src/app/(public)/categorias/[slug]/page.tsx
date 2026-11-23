import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { APP_NAME } from "@/constants/app";
import { categoryPath } from "@/constants/routes";
import { CategoryDetailPageView } from "@/features/marketplace/components/CategoryDetailPageView";
import {
  getCachedPublicCategoryDetail,
  getPublicCategoryBySlug,
  throwUnlessMissingOrInvalid,
} from "@/lib/public-record";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const category = await getPublicCategoryBySlug(slug);

    if (!category) {
      notFound();
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
  } catch (error) {
    throwUnlessMissingOrInvalid(error);
    return { title: "Categoria" };
  }
}

export default async function CategoryDetailPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  try {
    const category = await getPublicCategoryBySlug(slug);

    if (!category) {
      notFound();
    }
  } catch (error) {
    throwUnlessMissingOrInvalid(error);
    return <CategoryDetailPageView />;
  }

  const loaded = await getCachedPublicCategoryDetail(slug);

  if (!loaded.category || !loaded.advertisements) {
    notFound();
  }

  return (
    <CategoryDetailPageView
      initialCategories={loaded.categories}
      initialCategoriesUpdatedAt={loaded.fetchedAt}
      initialAdvertisements={loaded.advertisements}
      initialAdvertisementsUpdatedAt={loaded.fetchedAt}
      initialListingFilters={loaded.listingFilters}
    />
  );
}
