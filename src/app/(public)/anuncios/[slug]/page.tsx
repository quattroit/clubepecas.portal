import type { Metadata } from "next";

import { APP_NAME } from "@/constants/app";
import { advertisementPath } from "@/constants/routes";
import { AdvertisementDetailPageView } from "@/features/marketplace/components/AdvertisementDetailPageView";
import type { PublicAdvertisementDetail } from "@/lib/public-advertisement";
import {
  getCachedPublicAdvertisementDetail,
  getPublicAdvertisementBySlug,
  throwUnlessMissingOrInvalid,
} from "@/lib/public-record";
import { mapAdvertisementBySlugToAdvertisement } from "@/mappers/advertisement.mapper";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

type AdvertisementPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: AdvertisementPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const dto = await getPublicAdvertisementBySlug(slug);
    const advertisement = mapAdvertisementBySlugToAdvertisement(dto);
    const description =
      advertisement.description ??
      `${advertisement.title} em ${advertisement.city}, ${advertisement.state}.`;
    const url = `${SITE_URL}${advertisementPath(slug)}`;

    return {
      title: advertisement.title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: `${advertisement.title} | ${APP_NAME}`,
        description,
        url,
        siteName: APP_NAME,
        locale: "pt_BR",
        type: "website",
        ...(advertisement.imageUrl
          ? { images: [{ url: advertisement.imageUrl }] }
          : {}),
      },
    };
  } catch (error) {
    throwUnlessMissingOrInvalid(error);

    return {
      title: "Anúncio",
    };
  }
}

export default async function AdvertisementDetailPage({
  params,
}: AdvertisementPageProps) {
  const { slug } = await params;

  let initialData: PublicAdvertisementDetail | undefined;
  let initialDataUpdatedAt: number | undefined;

  try {
    const loaded = await getCachedPublicAdvertisementDetail(slug);
    initialData = loaded.detail;
    initialDataUpdatedAt = loaded.fetchedAt;
  } catch (error) {
    throwUnlessMissingOrInvalid(error);
  }

  return (
    <AdvertisementDetailPageView
      initialData={initialData}
      initialDataUpdatedAt={initialDataUpdatedAt}
    />
  );
}
