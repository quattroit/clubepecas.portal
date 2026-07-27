"use client";

import { useQuery } from "@tanstack/react-query";

import type { ListMyPartRequestsParams } from "@/contracts/part-requests";
import { useProfessionalBuyerAuthQueryEnabled } from "@/hooks/useProfessionalBuyerAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { partRequestService } from "@/services/part-request.service";

/** GET /api/v1/part-requests/me */
export function useMyPartRequests(params: ListMyPartRequestsParams = {}) {
  const authReady = useProfessionalBuyerAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.partRequests.me(params),
    enabled: authReady,
    queryFn: () => partRequestService.getMine(params),
  });
}
