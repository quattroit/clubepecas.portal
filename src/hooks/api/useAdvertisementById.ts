"use client";

import { useQuery } from "@tanstack/react-query";

import { mapAdvertisementDetailToFormValues } from "@/mappers/advertisement-form.mapper";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { advertisementService } from "@/services/advertisement.service";

/**
 * Carrega anúncio + fotos por id (painel — edição).
 */
export function useAdvertisementById(id: string) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.advertisements.detail(id),
    enabled: authReady && Boolean(id),
    refetchOnMount: "always",
    queryFn: async () => {
      const [dto, photosResponse] = await Promise.all([
        advertisementService.getById(id),
        advertisementService.getPhotos(id),
      ]);

      const photos = [...photosResponse.items].sort(
        (a, b) => a.displayOrder - b.displayOrder,
      );

      return {
        id: dto.id,
        title: dto.title,
        photos: photos.map((photo) => ({ id: photo.id, url: photo.url })),
        formValues: mapAdvertisementDetailToFormValues(dto, photos),
      };
    },
  });
}
