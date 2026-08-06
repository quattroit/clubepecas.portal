"use client";

import { useQuery } from "@tanstack/react-query";

import type { ListSellerQuotationsParams } from "@/contracts/quotations";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { quotationService } from "@/services/quotation.service";

/** GET /api/v1/seller/quotations */
export function useSellerQuotations(params: ListSellerQuotationsParams = {}) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.sellerQuotations.list(params),
    enabled: authReady,
    queryFn: () => quotationService.getSellerQuotations(params),
  });
}
