"use client";

import { useQuery } from "@tanstack/react-query";

import type { ListMyQuotationsParams } from "@/contracts/quotations";
import { useProfessionalBuyerAuthQueryEnabled } from "@/hooks/useProfessionalBuyerAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { quotationService } from "@/services/quotation.service";

/** GET /api/v1/quotations/me */
export function useMyQuotations(params: ListMyQuotationsParams = {}) {
  const authReady = useProfessionalBuyerAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.quotations.me(params),
    enabled: authReady,
    queryFn: () => quotationService.getMine(params),
  });
}
