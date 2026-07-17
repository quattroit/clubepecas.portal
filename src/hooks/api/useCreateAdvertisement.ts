"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { CreateAdvertisementRequest } from "@/contracts/advertisements/requests";
import { ROUTES } from "@/constants/routes";
import { ApiError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { advertisementService } from "@/services/advertisement.service";

type CreateAdvertisementInput = {
  request: CreateAdvertisementRequest;
  photoUrls: string[];
};

function isAdvertisementLimitError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;

  if (error.code === "advertisement.limit.reached") return true;

  return error.errors.some(
    (item) => item.code === "advertisement.limit.reached",
  );
}

/**
 * Cria anúncio + fotos opcionais (POST .../photos com { url }).
 * Invalida queryKeys.advertisements.me e subscription (cota).
 */
export function useCreateAdvertisement() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ request, photoUrls }: CreateAdvertisementInput) => {
      const created = await advertisementService.create(request);

      if (photoUrls.length > 0) {
        await Promise.all(
          photoUrls.map((url) =>
            advertisementService.createPhoto(created.id, { url }),
          ),
        );
      }

      return created;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.advertisements.me,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscription,
      });
      toast.success("Anúncio publicado com sucesso!");
      router.replace(ROUTES.MY_ADVERTISEMENTS);
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
