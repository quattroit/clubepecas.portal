"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/** Histórico financeiro do vendedor (CreatedAt DESC). */
export function useSellerPayments(enabled = true) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.seller.payments,
    enabled: authReady && enabled,
    queryFn: async () => {
      const response = await sellerService.listPayments();
      return response.items;
    },
  });
}
