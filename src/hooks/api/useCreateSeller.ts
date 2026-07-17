"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CreateSellerRequest } from "@/contracts/seller/requests";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { isCanceledError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

type CreateSellerInput = {
  request: CreateSellerRequest;
  photoFile?: File | null;
};

/**
 * Cria perfil de vendedor e, se houver, envia a foto em seguida.
 */
export function useCreateSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ request, photoFile }: CreateSellerInput) => {
      const created = await sellerService.create(request);

      if (photoFile) {
        try {
          await sellerService.uploadPhoto(photoFile);
        } catch (error) {
          if (isCanceledError(error)) throw error;
          toast.warning(
            `Perfil criado, mas a foto não pôde ser enviada: ${getFriendlyErrorMessage(error)}`,
          );
        }
      }

      return created;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.seller.me });
      toast.success("Perfil de vendedor criado com sucesso!");
    },
  });
}
