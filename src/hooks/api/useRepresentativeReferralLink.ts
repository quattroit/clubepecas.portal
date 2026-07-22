"use client";

import { useQuery } from "@tanstack/react-query";

import { useRepresentativeAuthQueryEnabled } from "@/hooks/useRepresentativeAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { representativePortalService } from "@/services/representative-portal.service";

/** GET /api/v1/representative/referral-link */
export function useRepresentativeReferralLink() {
  const authReady = useRepresentativeAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.representative.referralLink,
    enabled: authReady,
    queryFn: () => representativePortalService.getReferralLink(),
  });
}
