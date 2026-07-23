"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { isCanceledError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

type UseSyncSellerSubscriptionPaymentOptions = {
  silent?: boolean;
};

/**
 * POST /seller/subscription/sync-payment — sincroniza pagamento corrente com o Asaas.
 */
export function useSyncSellerSubscriptionPayment(
  options?: UseSyncSellerSubscriptionPaymentOptions,
) {
  const queryClient = useQueryClient();
  const silent = options?.silent ?? false;

  return useMutation({
    mutationFn: () => sellerService.syncSubscriptionPayment(),
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.seller.subscription,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.seller.subscriptionPayments,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.seller.subscriptionHistory,
        }),
      ]);
      const paid = result.paymentStatus?.toLowerCase() === "paid";
      if (silent) {
        if (paid) {
          toast.success("Pagamento confirmado. Seu plano foi ativado.");
        }
        return;
      }

      if (paid) {
        toast.success(result.message ?? "Pagamento sincronizado.");
      } else {
        toast.warning(
          result.message ??
            "Sincronização concluída, mas o pagamento ainda não está confirmado no Asaas.",
        );
      }
    },
    onError: (error) => {
      if (isCanceledError(error)) return;
      if (!silent) {
        toast.error(getFriendlyErrorMessage(error));
      }
    },
  });
}
