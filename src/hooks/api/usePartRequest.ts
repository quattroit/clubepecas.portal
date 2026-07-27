"use client";

import { useQuery } from "@tanstack/react-query";

import { useProfessionalBuyerAuthQueryEnabled } from "@/hooks/useProfessionalBuyerAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { partRequestService } from "@/services/part-request.service";

/** GET /api/v1/part-requests/{id} */
export function usePartRequest(id: number, enabled = true) {
  const authReady = useProfessionalBuyerAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.partRequests.detail(id),
    enabled: authReady && enabled && id > 0,
    queryFn: () => partRequestService.getById(id),
  });
}
