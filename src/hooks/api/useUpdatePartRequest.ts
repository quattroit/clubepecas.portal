"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { UpdatePartRequestRequest } from "@/contracts/part-requests";
import { professionalBuyerPartRequestPath } from "@/constants/routes";
import { queryKeys } from "@/lib/queryKeys";
import { partRequestService } from "@/services/part-request.service";

type UpdatePartRequestInput = {
  id: number;
  request: UpdatePartRequestRequest;
};

/** PUT /api/v1/part-requests/{id} */
export function useUpdatePartRequest() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, request }: UpdatePartRequestInput) =>
      partRequestService.update(id, request),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.partRequests.all });
      toast.success("Solicitação atualizada com sucesso!");
      router.replace(professionalBuyerPartRequestPath(variables.id));
    },
  });
}
