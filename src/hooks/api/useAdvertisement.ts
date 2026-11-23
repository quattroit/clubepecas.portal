"use client";

import { useQuery } from "@tanstack/react-query";

import type { PublicAdvertisementDetail } from "@/lib/public-advertisement";
import { loadPublicAdvertisementDetail } from "@/lib/public-advertisement";
import { queryKeys } from "@/lib/queryKeys";

const ADVERTISEMENT_STALE_TIME_MS = 60_000;

type UseAdvertisementOptions = {
  initialData?: PublicAdvertisementDetail;
  initialDataUpdatedAt?: number;
};

function matchesSlug(
  detail: PublicAdvertisementDetail | undefined,
  slug: string,
): detail is PublicAdvertisementDetail {
  const detailSlug = detail?.advertisement.slug;

  return (
    detail !== undefined &&
    typeof detailSlug === "string" &&
    detailSlug.toLowerCase() === slug.toLowerCase()
  );
}

/**
 * Detalhe público do anúncio por slug.
 * `initialData` vem do servidor. A queryKey inclui o slug, então outro anúncio
 * não reaproveita o cache anterior.
 */
export function useAdvertisement(
  slug: string,
  options?: UseAdvertisementOptions,
) {
  const seeded = options?.initialData;
  const initialData = matchesSlug(seeded, slug) ? seeded : undefined;

  return useQuery({
    queryKey: queryKeys.marketplace.detail(slug),
    queryFn: () => loadPublicAdvertisementDetail(slug),
    enabled: Boolean(slug),
    retry: false,
    staleTime: ADVERTISEMENT_STALE_TIME_MS,
    initialData,
    initialDataUpdatedAt: initialData
      ? options?.initialDataUpdatedAt
      : undefined,
  });
}
