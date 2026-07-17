"use client";

import { useQuery } from "@tanstack/react-query";

import { NotFoundError } from "@/lib/errors";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

function isSubscriptionNotFound(error: unknown): boolean {
  if (!(error instanceof NotFoundError)) return false;

  if (error.code === "seller.subscription.not_found") return true;

  return error.errors.some(
    (item) => item.code === "seller.subscription.not_found",
  );
}

/**
 * Assinatura ACTIVE do vendedor.
 * Sem assinatura → data: null (estado vazio, sem ErrorMessage).
 */
export function useCurrentSellerSubscription() {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.seller.subscription,
    enabled: authReady,
    refetchOnMount: "always",
    queryFn: async () => {
      try {
        return await sellerService.getCurrentSubscription();
      } catch (error) {
        if (isSubscriptionNotFound(error)) {
          return null;
        }
        throw error;
      }
    },
  });
}
