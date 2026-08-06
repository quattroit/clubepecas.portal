"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { UpdateSellerLocalDeliveryRequest } from "@/contracts/local-delivery";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/**
 * Salva configuração de Frete Local do vendedor.
 */
export function useUpdateSellerLocalDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSellerLocalDeliveryRequest) =>
      sellerService.updateLocalDelivery(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.localDelivery,
      });
      toast.success("Frete Local atualizado.");
    },
  });
}
