"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CompletePartRequestRequest } from "@/contracts/part-requests";
import { queryKeys } from "@/lib/queryKeys";
import { partRequestService } from "@/services/part-request.service";

/** POST /api/v1/part-requests/{id}/complete */
export function useCompletePartRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: CompletePartRequestRequest;
    }) => partRequestService.complete(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.partRequests.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.partRequests.detail(id),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.partRequests.suppliers(id),
      });
      toast.success("Solicitação finalizada.");
    },
  });
}
