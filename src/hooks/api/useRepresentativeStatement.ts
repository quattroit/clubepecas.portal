"use client";

import { useQuery } from "@tanstack/react-query";

import { useRepresentativeAuthQueryEnabled } from "@/hooks/useRepresentativeAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { representativePortalService } from "@/services/representative-portal.service";

/** GET /api/v1/representative/statement */
export function useRepresentativeStatement() {
  const authReady = useRepresentativeAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.representative.statement,
    enabled: authReady,
    queryFn: () => representativePortalService.getStatement(),
  });
}
