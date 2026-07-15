import type { Metadata } from "next";

import { APP_NAME } from "@/constants/app";
import { advertisementPath } from "@/constants/routes";
import { AdvertisementDetailPageView } from "@/features/marketplace/components/AdvertisementDetailPageView";
import { NotFoundError } from "@/lib/errors";
import { mapAdvertisementBySlugToAdvertisement } from "@/mappers/advertisement.mapper";
import { advertisementService } from "@/services/advertisement.service";

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
    const dto = await advertisementService.getBySlug(slug);
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
    if (error instanceof NotFoundError) {
      return {
        title: "Anúncio não encontrado",
      };
    }

    return {
      title: "Anúncio",
    };
  }
}

export default function AdvertisementDetailPage() {
  return <AdvertisementDetailPageView />;
}
