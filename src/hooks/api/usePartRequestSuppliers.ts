"use client";

import { useQuery } from "@tanstack/react-query";

import { PartRequestStatus } from "@/contracts/common/enums";
import { useProfessionalBuyerAuthQueryEnabled } from "@/hooks/useProfessionalBuyerAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { partRequestService } from "@/services/part-request.service";

/** GET /api/v1/part-requests/{id}/suppliers */
export function usePartRequestSuppliers(
  id: number,
  status: PartRequestStatus | undefined,
  enabled = true,
) {
  const authReady = useProfessionalBuyerAuthQueryEnabled();
  const shouldFetch =
    status === PartRequestStatus.Open || status === PartRequestStatus.Cancelled;

  return useQuery({
    queryKey: queryKeys.partRequests.suppliers(id),
    enabled: authReady && enabled && id > 0 && shouldFetch,
    queryFn: () => partRequestService.getSuppliers(id),
  });
}
