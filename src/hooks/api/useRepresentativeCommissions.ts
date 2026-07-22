"use client";

import { useQuery } from "@tanstack/react-query";

import type { RepresentativeCommissionsListParams } from "@/contracts/representative/portal";
import { useRepresentativeAuthQueryEnabled } from "@/hooks/useRepresentativeAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { representativePortalService } from "@/services/representative-portal.service";

/** GET /api/v1/representative/commissions */
export function useRepresentativeCommissions(
  params: RepresentativeCommissionsListParams = {},
) {
  const authReady = useRepresentativeAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.representative.commissions.list(
      params as Record<string, unknown>,
    ),
    enabled: authReady,
    queryFn: () => representativePortalService.listCommissions(params),
  });
}

/** GET /api/v1/representative/commissions/{id} */
export function useRepresentativeCommission(id: number, enabled = true) {
  const authReady = useRepresentativeAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.representative.commissions.detail(id),
    enabled: authReady && enabled && id > 0,
    queryFn: () => representativePortalService.getCommission(id),
  });
}
