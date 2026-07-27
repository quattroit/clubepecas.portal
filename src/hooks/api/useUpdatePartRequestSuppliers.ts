"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { partRequestService } from "@/services/part-request.service";

/** PUT /api/v1/part-requests/{id}/suppliers */
export function useUpdatePartRequestSuppliers(partRequestId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (selectedSellerIds: number[]) =>
      partRequestService.updateSuppliers(partRequestId, selectedSellerIds),
    onSuccess: (data) => {
      queryClient.setQueryData(
        queryKeys.partRequests.suppliers(partRequestId),
        data,
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.partRequests.suppliers(partRequestId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.partRequests.all });
    },
  });
}
