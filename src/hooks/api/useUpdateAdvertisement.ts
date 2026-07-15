"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { UpdateAdvertisementRequest } from "@/contracts/advertisements/requests";
import { ROUTES } from "@/constants/routes";
import { queryKeys } from "@/lib/queryKeys";
import { advertisementService } from "@/services/advertisement.service";

type ExistingPhoto = {
  id: string;
  url: string;
};

type UpdateAdvertisementInput = {
  id: string;
  request: UpdateAdvertisementRequest;
  photoUrls: string[];
  existingPhotos: ExistingPhoto[];
};

/**
 * Atualiza anúncio e sincroniza fotos (create/delete/order).
 */
export function useUpdateAdvertisement() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      id,
      request,
      photoUrls,
      existingPhotos,
    }: UpdateAdvertisementInput) => {
      const updated = await advertisementService.update(id, request);

      const desired = photoUrls
        .map((url) => url.trim())
        .filter(Boolean)
        .slice(0, 3);
      const existingByUrl = new Map(
        existingPhotos.map((photo) => [photo.url, photo]),
      );
      const desiredSet = new Set(desired);

      const toDelete = existingPhotos.filter(
        (photo) => !desiredSet.has(photo.url),
      );
      const toCreate = desired.filter((url) => !existingByUrl.has(url));

      await Promise.all([
        ...toDelete.map((photo) =>
          advertisementService.deletePhoto(id, photo.id),
        ),
        ...toCreate.map((url) =>
          advertisementService.createPhoto(id, { url }),
        ),
      ]);

      if (desired.length > 0) {
        const photosResponse = await advertisementService.getPhotos(id);
        const orderItems = desired.flatMap((url, index) => {
          const photo = photosResponse.items.find((item) => item.url === url);
          return photo ? [{ id: photo.id, displayOrder: index }] : [];
        });

        if (orderItems.length > 0) {
          await advertisementService.updatePhotoOrder(id, {
            items: orderItems,
          });
        }
      }

      return updated;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.advertisements.me,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.advertisements.detail(variables.id),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.advertisements.photos(variables.id),
      });
      toast.success("Anúncio atualizado com sucesso!");
      router.replace(ROUTES.MY_ADVERTISEMENTS);
    },
  });
}
