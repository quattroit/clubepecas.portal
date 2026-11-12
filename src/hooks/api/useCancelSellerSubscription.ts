"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { isCanceledError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/**
 * DELETE /seller/subscription — alias soft-cancel da renovação (Sprint 8.5).
 * Preferir `useCancelSellerSubscriptionRenewal` (PUT) na UI.
 */
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
      toast.success(
        "Renovação cancelada. Você mantém os benefícios até o fim do período.",
      );
    },
    onError: (error) => {
      if (isCanceledError(error)) return;
      toast.error(getFriendlyErrorMessage(error));
    },
  });
}
