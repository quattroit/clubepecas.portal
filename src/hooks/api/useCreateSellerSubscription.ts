"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CreateSellerSubscriptionRequest } from "@/contracts/seller/subscription";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

export function useCreateSellerSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSellerSubscriptionRequest) =>
      sellerService.createSubscription(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscription,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscriptions,
      });
      toast.success("Plano assinado com sucesso!");
    },
  });
}
