"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { UpdateMyProfessionalBuyerRequest } from "@/contracts/professional-buyers";
import { queryKeys } from "@/lib/queryKeys";
import { professionalBuyerService } from "@/services/professional-buyer.service";

export function useUpdateMyProfessionalBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMyProfessionalBuyerRequest) =>
      professionalBuyerService.updateMe(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.professionalBuyers.me, data);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.professionalBuyers.all,
      });
      toast.success("Perfil atualizado.");
    },
  });
}
