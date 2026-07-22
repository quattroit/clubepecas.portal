"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CancelAdminCommissionRequest } from "@/contracts/admin/commissions";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useApproveAdminCommission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.approveCommission(id),
    onSuccess: async () => {
      toast.success("Comissão aprovada.");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.commissions.all,
      });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (error) => toast.error(getFriendlyErrorMessage(error)),
  });
}

export function useCancelAdminCommission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: CancelAdminCommissionRequest & { id: number }) =>
      adminService.cancelCommission(id, payload),
    onSuccess: async () => {
      toast.success("Comissão cancelada.");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.commissions.all,
      });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (error) => toast.error(getFriendlyErrorMessage(error)),
  });
}
