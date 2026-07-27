"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/queryKeys";
import { partRequestService } from "@/services/part-request.service";

/** DELETE /api/v1/part-requests/{id} */
export function useCancelPartRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => partRequestService.cancel(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.partRequests.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.partRequests.detail(id),
      });
      toast.success("Solicitação cancelada.");
    },
  });
}
