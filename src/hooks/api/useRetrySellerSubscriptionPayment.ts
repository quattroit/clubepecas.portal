"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { PaymentRecoveryResponse } from "@/contracts/seller/subscription";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { isCanceledError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

function openRecoveryUrl(result: PaymentRecoveryResponse) {
  const url = result.checkoutUrl ?? result.invoiceUrl;
  if (url) {
    window.open(url, "_blank");
  }
}

/**
 * POST /seller/subscription/retry-payment — reintenta pagamento pendente/vencido.
 */
export function useRetrySellerSubscriptionPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sellerService.retrySubscriptionPayment(),
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.seller.subscription,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.seller.subscriptionPayments,
        }),
      ]);
      openRecoveryUrl(result);
      toast.success(result.message);
    },
    onError: (error) => {
      if (isCanceledError(error)) return;
      toast.error(getFriendlyErrorMessage(error));
    },
  });
}
