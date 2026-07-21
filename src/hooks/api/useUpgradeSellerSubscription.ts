"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { ApiError, isCanceledError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { buildSubscriptionCheckoutUrls } from "@/lib/subscriptionCheckoutUrls";
import { sellerService } from "@/services/seller.service";

type UpgradeVariables = {
  subscriptionPlanPriceId: number;
};

type UpgradeOptions = {
  onActivatedWithoutCheckout?: () => void;
};

/**
 * PUT /seller/subscription/upgrade — checkout ou ativação imediata (plano grátis).
 */
export function useUpgradeSellerSubscription(options?: UpgradeOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subscriptionPlanPriceId }: UpgradeVariables) => {
      const urls = buildSubscriptionCheckoutUrls();
      return sellerService.upgradeSubscription({
        subscriptionPlanPriceId,
        ...urls,
      });
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscription,
      });

      if (result.activatedWithoutCheckout) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.seller.subscriptions,
        });
        void queryClient.invalidateQueries({
          queryKey: queryKeys.seller.subscriptionPayments,
        });
        void queryClient.invalidateQueries({
          queryKey: queryKeys.seller.subscriptionHistory,
        });
        toast.success("Upgrade aplicado.");
        options?.onActivatedWithoutCheckout?.();
        return;
      }

      if (!result.checkoutUrl) {
        throw new ApiError("Checkout indisponível. Tente novamente.", {
          code: "payment.checkout.failed",
          statusCode: 502,
        });
      }

      window.location.href = result.checkoutUrl;
    },
    onError: (error) => {
      if (isCanceledError(error)) return;
      toast.error(getFriendlyErrorMessage(error));
    },
  });
}
