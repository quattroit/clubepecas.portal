"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { partRequestService } from "@/services/part-request.service";

/** POST /api/v1/part-requests/{id}/suppliers/{sellerId}/contact */
export function useContactPartRequestSupplier(partRequestId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sellerId: number) =>
      partRequestService.contactSupplier(partRequestId, sellerId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.partRequests.suppliers(partRequestId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.partRequests.all });
    },
  });
}
