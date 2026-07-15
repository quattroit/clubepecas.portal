import type { Metadata } from "next";

import { APP_NAME } from "@/constants/app";
import { storePath } from "@/constants/routes";
import { StoreDetailPageView } from "@/features/marketplace/components/StoreDetailPageView";
import { NotFoundError } from "@/lib/errors";
import { loadPublicStoreSlugs } from "@/lib/loadPublicStores";
import { mapSellerPublicProfileToSeller } from "@/mappers/seller.mapper";
import { sellerService } from "@/services/seller.service";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

type StorePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await loadPublicStoreSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const dto = await sellerService.getPublicBySlug(slug);
    const seller = mapSellerPublicProfileToSeller(dto);
    const description =
      seller.description ??
      `Veja anúncios de ${seller.name} em ${seller.city}, ${seller.state}.`;
    const url = `${SITE_URL}${storePath(slug)}`;

    return {
      title: seller.name,
      description,
      alternates: { canonical: url },
      openGraph: {
        title: `${seller.name} | ${APP_NAME}`,
        description,
        url,
        siteName: APP_NAME,
        locale: "pt_BR",
        type: "profile",
        ...(seller.avatarUrl ? { images: [{ url: seller.avatarUrl }] } : {}),
      },
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { title: "Loja não encontrada" };
    }

    return { title: "Loja" };
  }
}

export default function StorePage() {
  return <StoreDetailPageView />;
}
