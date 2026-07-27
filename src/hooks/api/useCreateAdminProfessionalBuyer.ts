"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CreateProfessionalBuyerRequest } from "@/contracts/professional-buyers";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useCreateAdminProfessionalBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProfessionalBuyerRequest) =>
      adminService.createProfessionalBuyer(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.professionalBuyers.all,
      });
      toast.success("Comprador profissional cadastrado.");
    },
  });
}
