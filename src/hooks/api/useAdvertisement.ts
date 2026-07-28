"use client";

import { useQuery } from "@tanstack/react-query";

import {
  mapAdvertisementBySlugToAdvertisement,
  mapRelatedMarketplaceItems,
} from "@/mappers/advertisement.mapper";
import { mapAdvertisementBySlugSeller } from "@/mappers/seller.mapper";
import { queryKeys } from "@/lib/queryKeys";
import { advertisementService } from "@/services/advertisement.service";
import { categoryService } from "@/services/category.service";

/**
 * Detalhe público do anúncio por slug.
 * Relacionados: marketplace filtrado pela categoria do anúncio (evita lista completa sem filtro).
 */
export function useAdvertisement(slug: string) {
  return useQuery({
    queryKey: queryKeys.marketplace.detail(slug),
    queryFn: async () => {
      const dto = await advertisementService.getBySlug(slug);
      const marketplace = await categoryService.getMarketplace({
        categorySlug: dto.categorySlug || undefined,
      });

      const advertisement = mapAdvertisementBySlugToAdvertisement(dto);
      const seller = mapAdvertisementBySlugSeller(dto);
      const related = mapRelatedMarketplaceItems(marketplace.items, slug, 4);

      return {
        advertisement,
        seller,
        related,
        images: advertisement.images ?? [],
        thumbnails: advertisement.thumbnails ?? advertisement.images ?? [],
      };
    },
    enabled: Boolean(slug),
    retry: false,
  });
}
