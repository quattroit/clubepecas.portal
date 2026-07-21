"use client";

import { useQuery } from "@tanstack/react-query";

import { mapAdvertisementDetailToFormValues } from "@/mappers/advertisement-form.mapper";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { advertisementService } from "@/services/advertisement.service";

/**
 * Carrega anúncio + fotos por id (painel — edição).
 */
export function useAdvertisementById(id: number) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.advertisements.detail(id),
    enabled: authReady && Boolean(id),
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
        photos,
        maxPhotos: photosResponse.maxPhotos,
        usedCount: photosResponse.usedCount,
        remaining: photosResponse.remaining,
        maxFileSizeMB: photosResponse.maxFileSizeMB,
        formValues: mapAdvertisementDetailToFormValues(dto),
      };
    },
  });
}
