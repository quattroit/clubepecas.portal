"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { quotationService } from "@/services/quotation.service";

/** GET /api/v1/quotations/{id} */
export function useMyQuotation(id: number, enabled = true) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.quotations.detail(id),
    enabled: authReady && enabled && id > 0,
    queryFn: () => quotationService.getMineById(id),
  });
}
