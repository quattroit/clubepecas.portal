"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { CreatePartRequestRequest } from "@/contracts/part-requests";
import { professionalBuyerPartRequestPath } from "@/constants/routes";
import { queryKeys } from "@/lib/queryKeys";
import { partRequestService } from "@/services/part-request.service";

/** POST /api/v1/part-requests */
export function useCreatePartRequest() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (request: CreatePartRequestRequest) =>
      partRequestService.create(request),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.partRequests.all });
      toast.success("Solicitação criada com sucesso!");
      router.replace(professionalBuyerPartRequestPath(data.id));
    },
  });
}
