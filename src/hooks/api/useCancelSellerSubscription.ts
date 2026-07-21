"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { ApiError, isCanceledError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

function isTimeoutOrNetwork(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.code === "network.timeout" || error.code === "network.unavailable")
  );
}

/** DELETE /seller/subscription → 404 se já não houver ACTIVE. */
function isAlreadyCancelled(error: unknown): boolean {
  if (!(error instanceof ApiError) || error.statusCode !== 404) return false;

  if (error.code === "seller.subscription.not_found") return true;

  return error.errors.some(
    (item) => item.code === "seller.subscription.not_found",
  );
}

async function hasNoActiveSubscription(): Promise<boolean> {
  try {
    await sellerService.getCurrentSubscription();
    return false;
  } catch (error) {
    return isAlreadyCancelled(error);
  }
}

/**
 * Cancela a assinatura ACTIVE.
 * Se o DELETE gravar no servidor mas a resposta falhar (ex.: timeout no e-mail),
 * confirma via GET e trata como sucesso.
 */
export function useCancelSellerSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        return await sellerService.cancelSubscription();
      } catch (error) {
        if (isCanceledError(error)) throw error;

        if (isAlreadyCancelled(error)) {
          return null;
        }

        if (isTimeoutOrNetwork(error) && (await hasNoActiveSubscription())) {
          return null;
        }

        throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.seller.subscription, null);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscription,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscriptions,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionPlans.all,
      });
      toast.success("Assinatura cancelada.");
    },
    onError: (error) => {
      toast.error(getFriendlyErrorMessage(error));
    },
  });
}
