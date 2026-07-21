"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/** GET /seller/subscription/history — eventos da assinatura. */
export function useSellerSubscriptionHistory(enabled = true) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.seller.subscriptionHistory,
    enabled: authReady && enabled,
    queryFn: async () => {
      const response = await sellerService.listSubscriptionHistory();
      return response.items;
    },
  });
}
