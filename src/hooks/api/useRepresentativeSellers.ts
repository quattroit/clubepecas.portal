"use client";

import { useQuery } from "@tanstack/react-query";

import type { RepresentativeSellersListParams } from "@/contracts/representative/portal";
import { useRepresentativeAuthQueryEnabled } from "@/hooks/useRepresentativeAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { representativePortalService } from "@/services/representative-portal.service";

/** GET /api/v1/representative/sellers */
export function useRepresentativeSellers(
  params: RepresentativeSellersListParams = {},
) {
  const authReady = useRepresentativeAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.representative.sellers.list(params),
    enabled: authReady,
    queryFn: () => representativePortalService.listSellers(params),
  });
}
