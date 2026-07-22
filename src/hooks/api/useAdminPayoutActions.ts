"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  CancelAdminPayoutRequest,
  CreateAdminPayoutRequest,
  PayAdminPayoutRequest,
} from "@/contracts/admin/payouts";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/** POST /api/v1/admin/payouts (Sprint 10.7) */
export function useCreateAdminPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdminPayoutRequest) =>
      adminService.createPayout(payload),
    onSuccess: async () => {
      toast.success("Pagamento criado com sucesso.");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.payouts.all,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.commissions.all,
      });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (error) => toast.error(getFriendlyErrorMessage(error)),
  });
}

/** POST /api/v1/admin/payouts/{id}/pay */
export function usePayAdminPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: PayAdminPayoutRequest & { id: number }) =>
      adminService.payPayout(id, payload),
    onSuccess: async () => {
      toast.success("Pagamento confirmado.");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.payouts.all,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.commissions.all,
      });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (error) => toast.error(getFriendlyErrorMessage(error)),
  });
}

/** POST /api/v1/admin/payouts/{id}/cancel */
export function useCancelAdminPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: CancelAdminPayoutRequest & { id: number }) =>
      adminService.cancelPayout(id, payload),
    onSuccess: async () => {
      toast.success("Pagamento cancelado.");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.payouts.all,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.commissions.all,
      });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (error) => toast.error(getFriendlyErrorMessage(error)),
  });
}
