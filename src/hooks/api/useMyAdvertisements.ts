"use client";

import { useQuery } from "@tanstack/react-query";

import { mapMyAdvertisementItemToAdvertisement } from "@/mappers/advertisement.mapper";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { advertisementService } from "@/services/advertisement.service";

/**
 * Lista os anúncios do vendedor autenticado (GET /advertisements/me).
 * Thumbnail vem embutida no item — sem N+1 de /photos.
 */
export function useMyAdvertisements() {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.advertisements.me,
    enabled: authReady,
    queryFn: async () => {
      const response = await advertisementService.getMine();
      return response.items.map((item) =>
        mapMyAdvertisementItemToAdvertisement(item, {
          imageUrl: item.thumbnailUrl,
        }),
      );
    },
  });
}
