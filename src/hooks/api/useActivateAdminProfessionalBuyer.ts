"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useActivateAdminProfessionalBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminService.activateProfessionalBuyer(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.professionalBuyers.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.professionalBuyers.detail(id),
      });
      toast.success("Comprador profissional ativado.");
    },
  });
}
