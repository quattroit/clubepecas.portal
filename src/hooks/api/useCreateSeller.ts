"use client";

import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CreateSellerRequest } from "@/contracts/seller/requests";
import type { CreateSellerResponse } from "@/contracts/seller/responses";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { ApiError, isCanceledError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { mapSellerMeToSeller } from "@/mappers/seller.mapper";
import { sellerService } from "@/services/seller.service";

type CreateSellerInput = {
  request: CreateSellerRequest;
  photoFile?: File | null;
  coverFile?: File | null;
};

type CreateSellerResult = CreateSellerResponse & {
  alreadyExisted?: boolean;
};

function isSellerAlreadyExists(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  if (error.code === "seller.already_exists") return true;
  return error.errors.some((item) => item.code === "seller.already_exists");
}

async function syncSellerMeCache(queryClient: QueryClient) {
  const me = await sellerService.getMe();
  queryClient.setQueryData(queryKeys.seller.me, mapSellerMeToSeller(me));
  return me;
}

/**
 * Cria perfil de vendedor e, se houver, envia foto e capa em seguida.
 * Após criar (ou se já existir — 409), sincroniza o cache de `seller.me`
 * para o formulário sair do modo criação.
 */
export function useCreateSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      request,
      photoFile,
      coverFile,
    }: CreateSellerInput): Promise<CreateSellerResult> => {
      try {
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

        if (coverFile) {
          try {
            await sellerService.uploadCover(coverFile);
          } catch (error) {
            if (isCanceledError(error)) throw error;
            toast.warning(
              `Perfil criado, mas a capa não pôde ser enviada: ${getFriendlyErrorMessage(error)}`,
            );
          }
        }

        await syncSellerMeCache(queryClient);
        return created;
      } catch (error) {
        if (!isSellerAlreadyExists(error)) {
          throw error;
        }

        const existing = await syncSellerMeCache(queryClient);
        return {
          id: existing.id,
          storeName: existing.storeName,
          displayName: existing.displayName,
          alreadyExisted: true,
        };
      }
    },
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.seller.me });

      if (result.alreadyExisted) {
        toast.message("Você já possui um perfil de vendedor.");
        return;
      }

      toast.success("Perfil de vendedor criado com sucesso!");
    },
  });
}
