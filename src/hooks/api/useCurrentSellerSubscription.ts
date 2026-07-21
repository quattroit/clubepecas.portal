"use client";

import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/lib/errors";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/**
 * GET /seller/subscription responde 404 quando não há ACTIVE
 * (`seller.subscription.not_found`) ou sem perfil (`seller.not_found`).
 * Ambos são estado vazio válido na UI — não erro.
 */
function isCurrentSubscriptionAbsent(error: unknown): boolean {
  return error instanceof ApiError && error.statusCode === 404;
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
    retry: false,
    queryFn: async () => {
      try {
        return await sellerService.getCurrentSubscription();
      } catch (error) {
        if (isCurrentSubscriptionAbsent(error)) {
          return null;
        }
        throw error;
      }
    },
  });
}
