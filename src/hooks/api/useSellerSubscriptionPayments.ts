"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/** GET /seller/subscription/payments — histórico financeiro da assinatura. */
export function useSellerSubscriptionPayments(enabled = true) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.seller.subscriptionPayments,
    enabled: authReady && enabled,
    queryFn: async () => {
      const response = await sellerService.listSubscriptionPayments();
      return response.items;
    },
  });
}
