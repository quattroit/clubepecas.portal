"use client";

import { useQuery } from "@tanstack/react-query";

import type { PublicStoreDetail } from "@/lib/public-store";
import { loadPublicStoreDetail } from "@/lib/public-store";
import { queryKeys } from "@/lib/queryKeys";

const STORE_STALE_TIME_MS = 60_000;

type UseStoreOptions = {
  initialData?: PublicStoreDetail;
  initialDataUpdatedAt?: number;
};

function matchesSlug(
  detail: PublicStoreDetail | undefined,
  slug: string,
): detail is PublicStoreDetail {
  const detailSlug = detail?.seller.slug;

  return (
    detail !== undefined &&
    typeof detailSlug === "string" &&
    detailSlug.toLowerCase() === slug.toLowerCase()
  );
}

/**
 * Detalhe público da loja por slug.
 * `initialData` vem do servidor. A queryKey inclui o slug, então outra loja
 * não reaproveita o cache anterior.
 */
export function useStore(slug: string, options?: UseStoreOptions) {
  const seeded = options?.initialData;
  const initialData = matchesSlug(seeded, slug) ? seeded : undefined;

  return useQuery({
    queryKey: queryKeys.marketplace.store(slug),
    queryFn: () => loadPublicStoreDetail(slug),
    enabled: Boolean(slug),
    retry: false,
    staleTime: STORE_STALE_TIME_MS,
    initialData,
    initialDataUpdatedAt: initialData
      ? options?.initialDataUpdatedAt
      : undefined,
  });
}
