"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { CreateAdvertisementRequest } from "@/contracts/advertisements/requests";
import { ROUTES, editAdvertisementPath } from "@/constants/routes";
import { ApiError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { advertisementService } from "@/services/advertisement.service";

type CreateAdvertisementInput = {
  request: CreateAdvertisementRequest;
};

function isAdvertisementLimitError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;

  if (error.code === "advertisement.limit.reached") return true;

  return error.errors.some(
    (item) => item.code === "advertisement.limit.reached",
  );
}

/**
 * Cria anúncio. Fotos são enviadas depois na tela de edição (multipart).
 */
export function useCreateAdvertisement() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ request }: CreateAdvertisementInput) => {
      return advertisementService.create(request);
    },
    onSuccess: (created) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.advertisements.me,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscription,
      });
      toast.success("Anúncio publicado! Agora você pode adicionar fotos.");
      router.replace(editAdvertisementPath(created.id));
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
