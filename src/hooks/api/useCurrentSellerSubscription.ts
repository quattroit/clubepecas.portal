"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/components/providers/AuthProvider";
import { SellerSubscriptionStatus, UserRole } from "@/contracts/common/enums";
import { ApiError } from "@/lib/errors";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/**
 * GET /seller/subscription responde 404 quando não há ACTIVE/PENDING
 * (`seller.subscription.not_found`) ou sem perfil (`seller.not_found`).
 * Ambos são estado vazio válido na UI — não erro.
 */
function isCurrentSubscriptionAbsent(error: unknown): boolean {
  return error instanceof ApiError && error.statusCode === 404;
}

/**
 * Assinatura ACTIVE ou PENDING do vendedor.
 * Só consulta quando o role é Seller.
 * Sem assinatura → data: null. Refetch periódico quando Pending (aguarda webhook).
 */
export function useCurrentSellerSubscription() {
  const authReady = useAuthQueryEnabled();
  const { user } = useAuth();
  const isSeller = user?.role === UserRole.Seller;

  return useQuery({
    queryKey: queryKeys.seller.subscription,
    enabled: authReady && isSeller,
    retry: false,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === SellerSubscriptionStatus.Pending) {
        return 15_000;
      }
      return false;
    },
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
