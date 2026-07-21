"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { BillingCycle } from "@/contracts/common/enums";
import { ApiError, isCanceledError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { buildSubscriptionCheckoutUrls } from "@/lib/subscriptionCheckoutUrls";
import { sellerService } from "@/services/seller.service";

type CreateCheckoutVariables = {
  subscriptionPlanId: number;
  billingCycle: BillingCycle;
};

function isProviderError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  if (error.code === "payment.provider.error") return true;
  return error.errors.some((item) => item.code === "payment.provider.error");
}

type CheckoutMutationOptions = {
  onActivatedWithoutCheckout?: () => void;
};

/**
 * Inicia checkout hospedado (Asaas) e redireciona o vendedor.
 * Planos R$ 0 são ativados localmente sem gateway.
 */
export function useCreateSellerSubscriptionCheckout(
  options?: CheckoutMutationOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subscriptionPlanId,
      billingCycle,
    }: CreateCheckoutVariables) => {
      const urls = buildSubscriptionCheckoutUrls();

      return sellerService.createSubscriptionCheckout({
        subscriptionPlanId,
        billingCycle,
        ...urls,
      });
    },
    onSuccess: async (result) => {
      if (result.activatedWithoutCheckout) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryKeys.seller.subscription,
          }),
          queryClient.invalidateQueries({
            queryKey: queryKeys.seller.subscriptions,
          }),
          queryClient.invalidateQueries({
            queryKey: queryKeys.seller.payments,
          }),
        ]);
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
    retry: (failureCount, error) => {
      if (isCanceledError(error)) return false;
      if (failureCount >= 2) return false;
      return isProviderError(error);
    },
  });
}
