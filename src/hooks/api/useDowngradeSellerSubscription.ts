"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { isCanceledError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

type DowngradeVariables = {
  subscriptionPlanPriceId: number;
};

/**
 * PUT /seller/subscription/downgrade — agenda alteração para o fim do período.
 */
export function useDowngradeSellerSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subscriptionPlanPriceId }: DowngradeVariables) =>
      sellerService.downgradeSubscription({ subscriptionPlanPriceId }),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscription,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscriptionHistory,
      });
      toast.success(result.message || "Downgrade agendado.");
    },
    onError: (error) => {
      if (isCanceledError(error)) return;
      toast.error(getFriendlyErrorMessage(error));
    },
  });
}
