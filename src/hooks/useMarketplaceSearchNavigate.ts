"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

import { ROUTES } from "@/constants/routes";
import {
  buildAdvertisementsHref,
  normalizeSearchQuery,
  parseMarketplaceListingFilters,
} from "@/utils/marketplace-search";

/**
 * Navegação da busca global → `/anuncios?q=…` (URL é a fonte da verdade).
 * Em `/anuncios`, preserva filtros já aplicados na URL.
 */
export function useMarketplaceSearchNavigate() {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (rawQuery: string) => {
      const q = normalizeSearchQuery(rawQuery);
      const onListPage = pathname === ROUTES.ADVERTISEMENTS;

      if (onListPage && typeof window !== "undefined") {
        const current = parseMarketplaceListingFilters(window.location.search);
        router.push(buildAdvertisementsHref({ ...current, q }));
        return;
      }

      router.push(buildAdvertisementsHref({ q }));
    },
    [pathname, router],
  );
}
