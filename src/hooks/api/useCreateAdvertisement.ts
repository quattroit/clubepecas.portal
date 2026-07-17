"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { CreateAdvertisementRequest } from "@/contracts/advertisements/requests";
import { ROUTES } from "@/constants/routes";
import { ApiError, isCanceledError } from "@/lib/errors";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { queryKeys } from "@/lib/queryKeys";
import { advertisementService } from "@/services/advertisement.service";

type CreateAdvertisementInput = {
  request: CreateAdvertisementRequest;
  photos?: File[];
};

function isAdvertisementLimitError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;

  if (error.code === "advertisement.limit.reached") return true;

  return error.errors.some(
    (item) => item.code === "advertisement.limit.reached",
  );
}

/**
 * Cria anúncio e, se houver, envia as fotos em seguida.
 */
export function useCreateAdvertisement() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ request, photos = [] }: CreateAdvertisementInput) => {
      const created = await advertisementService.create(request);

      let uploaded = 0;
      const failures: string[] = [];

      for (const file of photos.slice(0, 3)) {
        try {
          await advertisementService.uploadPhoto(created.id, file);
          uploaded += 1;
        } catch (error) {
          if (isCanceledError(error)) throw error;
          failures.push(getFriendlyErrorMessage(error));
        }
      }

      return { created, uploaded, failures, photoCount: photos.length };
    },
    onSuccess: ({ created, uploaded, failures, photoCount }) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.advertisements.me,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscription,
      });

      if (photoCount === 0) {
        toast.success("Anúncio publicado com sucesso!");
      } else if (failures.length === 0) {
        toast.success(
          uploaded === 1
            ? "Anúncio publicado com 1 foto!"
            : `Anúncio publicado com ${uploaded} fotos!`,
        );
      } else if (uploaded > 0) {
        toast.warning(
          `Anúncio publicado, mas ${failures.length} foto(s) falharam no envio.`,
        );
      } else {
        toast.warning(
          "Anúncio publicado, porém as fotos não puderam ser enviadas. Você pode adicioná-las na edição.",
        );
      }

      router.replace(ROUTES.MY_ADVERTISEMENTS);
      return created;
    },
    onError: (error) => {
      if (isAdvertisementLimitError(error)) {
        toast.error(
          "Você atingiu o limite de anúncios permitido pelo seu plano.",
        );
      }
    },
  });
}
