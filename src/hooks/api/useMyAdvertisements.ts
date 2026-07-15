"use client";

import { useQuery } from "@tanstack/react-query";

import { mapMyAdvertisementItemToAdvertisement } from "@/mappers/advertisement.mapper";
import { queryKeys } from "@/lib/queryKeys";
import { advertisementService } from "@/services/advertisement.service";

/**
 * Lista os anúncios do vendedor autenticado (GET /advertisements/me).
 * Enriquece com a 1ª foto via GET .../photos — a listagem "me" não devolve thumbnail.
 */
export function useMyAdvertisements() {
  return useQuery({
    queryKey: queryKeys.advertisements.me,
    queryFn: async () => {
      const response = await advertisementService.getMine();

      return Promise.all(
        response.items.map(async (item) => {
          try {
            const photosResponse = await advertisementService.getPhotos(
              item.id,
            );
            const firstPhoto = [...photosResponse.items].sort(
              (a, b) => a.displayOrder - b.displayOrder,
            )[0];

            return mapMyAdvertisementItemToAdvertisement(item, {
              imageUrl: firstPhoto?.url ?? null,
            });
          } catch {
            return mapMyAdvertisementItemToAdvertisement(item);
          }
        }),
      );
    },
  });
}
