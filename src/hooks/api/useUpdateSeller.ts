"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { UpdateSellerRequest } from "@/contracts/seller/requests";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/**
 * Atualiza perfil de vendedor. Invalida apenas queryKeys.seller.me.
 */
export function useUpdateSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSellerRequest) => sellerService.update(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.seller.me });
      toast.success("Perfil atualizado com sucesso!");
    },
  });
}
