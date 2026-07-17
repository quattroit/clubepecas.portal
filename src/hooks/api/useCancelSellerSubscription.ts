"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

export function useCancelSellerSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sellerService.cancelSubscription(),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscription,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscriptions,
      });
      toast.success("Assinatura cancelada.");
    },
  });
}
