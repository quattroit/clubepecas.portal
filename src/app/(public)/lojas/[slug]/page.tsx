import type { Metadata } from "next";

import { APP_NAME } from "@/constants/app";
import { storePath } from "@/constants/routes";
import { StoreDetailPageView } from "@/features/marketplace/components/StoreDetailPageView";
import type { PublicStoreDetail } from "@/lib/public-store";
import {
  getCachedPublicStoreDetail,
  getPublicStoreBySlug,
  throwUnlessMissingOrInvalid,
} from "@/lib/public-record";
import { mapSellerPublicProfileToSeller } from "@/mappers/seller.mapper";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

type StorePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const dto = await getPublicStoreBySlug(slug);
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
    throwUnlessMissingOrInvalid(error);

    return { title: "Loja" };
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;

  let initialData: PublicStoreDetail | undefined;
  let initialDataUpdatedAt: number | undefined;

  try {
    const loaded = await getCachedPublicStoreDetail(slug);
    initialData = loaded.detail;
    initialDataUpdatedAt = loaded.fetchedAt;
  } catch (error) {
    throwUnlessMissingOrInvalid(error);
  }

  return (
    <StoreDetailPageView
      initialData={initialData}
      initialDataUpdatedAt={initialDataUpdatedAt}
    />
  );
}
