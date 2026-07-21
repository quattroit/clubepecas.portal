"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  CreateSellerSubscriptionRequest,
  SellerSubscriptionDto,
} from "@/contracts/seller/subscription";
import { ApiError, isCanceledError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

function isTimeoutOrNetwork(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.code === "network.timeout" || error.code === "network.unavailable")
  );
}

function isAlreadyActive(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  if (error.code === "seller.subscription.already_active") return true;
  return error.errors.some(
    (item) => item.code === "seller.subscription.already_active",
  );
}

function withUsageDefaults(
  subscription: Omit<
    SellerSubscriptionDto,
    "advertisementsUsed" | "advertisementsRemaining"
  > &
    Partial<
      Pick<SellerSubscriptionDto, "advertisementsUsed" | "advertisementsRemaining">
    >,
): SellerSubscriptionDto {
  const used = subscription.advertisementsUsed ?? 0;
  const limit = subscription.advertisementLimit;
  return {
    ...subscription,
    advertisementsUsed: used,
    advertisementsRemaining:
      subscription.advertisementsRemaining ?? Math.max(0, limit - used),
  };
}

/**
 * Assina um plano. Se o POST gravar no servidor mas a resposta falhar
 * (ex.: timeout no e-mail), tenta recuperar via GET da assinatura ativa.
 */
export function useCreateSellerSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: CreateSellerSubscriptionRequest,
    ): Promise<SellerSubscriptionDto> => {
      try {
        const created = await sellerService.createSubscription(payload);
        return withUsageDefaults(created);
      } catch (error) {
        if (isCanceledError(error)) throw error;

        if (isTimeoutOrNetwork(error) || isAlreadyActive(error)) {
          try {
            const current = await sellerService.getCurrentSubscription();
            if (
              current &&
              (isAlreadyActive(error) ||
                current.subscriptionPlanId === payload.subscriptionPlanId)
            ) {
              return withUsageDefaults(current);
            }
          } catch {
            // Mantém o erro original se a recuperação falhar.
          }
        }

        throw error;
      }
    },
    onSuccess: (subscription) => {
      queryClient.setQueryData(queryKeys.seller.subscription, subscription);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscription,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.subscriptions,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionPlans.all,
      });
      toast.success("Plano assinado com sucesso!");
    },
  });
}
