"use client";

import { useQuery } from "@tanstack/react-query";

import { mapPublicSellerAdvertisementToAdvertisement } from "@/mappers/advertisement.mapper";
import { mapSellerPublicProfileToSeller } from "@/mappers/seller.mapper";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/**
 * Detalhe público da loja por slug.
 *
 * Fluxo: sellerService.getPublicBySlug → DTO (com advertisements)
 * → mappers → seller + advertisements
 */
export function useStore(slug: string) {
  return useQuery({
    queryKey: queryKeys.marketplace.store(slug),
    queryFn: async () => {
      const dto = await sellerService.getPublicBySlug(slug);
      const seller = mapSellerPublicProfileToSeller(dto);
      const advertisements = dto.advertisements.map((item) =>
        mapPublicSellerAdvertisementToAdvertisement(item, {
          city: dto.city,
          state: dto.state,
        }),
      );
      const categoriesCount = new Set(
        advertisements.map((item) => item.category),
      ).size;

      return {
        seller,
        advertisements,
        categoriesCount,
      };
    },
    enabled: Boolean(slug),
    retry: false,
  });
}
