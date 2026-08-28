"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { partRequestService } from "@/services/part-request.service";

/**
 * GET /api/v1/part-requests/{id}/suppliers/{sellerId}/advertisements
 */
export function usePartRequestSupplierAdvertisements(
  partRequestId: number,
  sellerId: number,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.partRequests.supplierAdvertisements(
      partRequestId,
      sellerId,
    ),
    queryFn: () =>
      partRequestService.getSupplierAdvertisements(partRequestId, sellerId),
    enabled: enabled && partRequestId > 0 && sellerId > 0,
  });
}
