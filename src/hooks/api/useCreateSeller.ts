"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CreateSellerRequest } from "@/contracts/seller/requests";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/**
 * Cria perfil de vendedor. Invalida apenas queryKeys.seller.me.
 */
export function useCreateSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSellerRequest) => sellerService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.seller.me });
      toast.success("Perfil de vendedor criado com sucesso!");
    },
  });
}
