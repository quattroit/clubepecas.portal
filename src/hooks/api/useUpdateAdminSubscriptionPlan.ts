"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAdminSubscriptionPlanRequest } from "@/contracts/admin/subscription-plans";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Atualiza plano de assinatura administrativo.
 */
export function useUpdateAdminSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: UpdateAdminSubscriptionPlanRequest & { id: string }) =>
      adminService.updateSubscriptionPlan(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.subscriptionPlans.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.subscriptionPlans.detail(variables.id),
      });
    },
  });
}
