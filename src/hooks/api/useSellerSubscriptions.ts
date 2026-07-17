"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/** Histórico de assinaturas do vendedor (StartDate DESC). */
export function useSellerSubscriptions(enabled = true) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.seller.subscriptions,
    enabled: authReady && enabled,
    queryFn: async () => {
      const response = await sellerService.listSubscriptions();
      return response.items;
    },
  });
}
