"use client";

import { useQuery } from "@tanstack/react-query";

import { useRepresentativeAuthQueryEnabled } from "@/hooks/useRepresentativeAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { representativePortalService } from "@/services/representative-portal.service";

/** GET /api/v1/representative/sellers/{id} */
export function useRepresentativeSeller(id: number, enabled = true) {
  const authReady = useRepresentativeAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.representative.sellers.detail(id),
    enabled: authReady && enabled && id > 0,
    queryFn: () => representativePortalService.getSeller(id),
  });
}
