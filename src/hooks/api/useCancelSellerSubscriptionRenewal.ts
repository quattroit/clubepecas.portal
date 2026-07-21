"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CancelSellerSubscriptionRenewalRequest } from "@/contracts/seller/subscription";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { isCanceledError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/**
 * PUT /seller/subscription/cancel — cancela renovação (benefícios até o fim do período).
 */
export function useCancelSellerSubscriptionRenewal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload?: CancelSellerSubscriptionRenewalRequest) =>
      sellerService.cancelSubscriptionRenewal(payload),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscription,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscriptionHistory,
      });
      toast.success(
        result.message ||
          "Renovação cancelada. Você mantém os benefícios até o fim do período.",
      );
    },
    onError: (error) => {
      if (isCanceledError(error)) return;
      toast.error(getFriendlyErrorMessage(error));
    },
  });
}
