"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { quotationService } from "@/services/quotation.service";

/** GET /api/v1/seller/quotations/{id} */
export function useSellerQuotation(id: number, enabled = true) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.sellerQuotations.detail(id),
    enabled: authReady && enabled && id > 0,
    queryFn: () => quotationService.getSellerQuotationById(id),
  });
}
