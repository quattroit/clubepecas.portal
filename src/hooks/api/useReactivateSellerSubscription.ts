"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { isCanceledError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/**
 * PUT /seller/subscription/reactivate — reativa após CancellationRequested.
 */
export function useReactivateSellerSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sellerService.reactivateSubscription(),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscription,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscriptionHistory,
      });
      toast.success(result.message || "Assinatura reativada.");
    },
    onError: (error) => {
      if (isCanceledError(error)) return;
      toast.error(getFriendlyErrorMessage(error));
    },
  });
}
