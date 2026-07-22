"use client";

import { useQuery } from "@tanstack/react-query";

import type { RepresentativePayoutsListParams } from "@/contracts/representative/portal";
import { useRepresentativeAuthQueryEnabled } from "@/hooks/useRepresentativeAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { representativePortalService } from "@/services/representative-portal.service";

/** GET /api/v1/representative/payouts (Sprint 10.7) */
export function useRepresentativePayouts(
  params: RepresentativePayoutsListParams = {},
) {
  const authReady = useRepresentativeAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.representative.payouts.list(
      params as Record<string, unknown>,
    ),
    enabled: authReady,
    queryFn: () => representativePortalService.listPayouts(params),
  });
}

/** GET /api/v1/representative/payouts/{id} */
export function useRepresentativePayout(id: number, enabled = true) {
  const authReady = useRepresentativeAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.representative.payouts.detail(id),
    enabled: authReady && enabled && id > 0,
    queryFn: () => representativePortalService.getPayout(id),
  });
}
