"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateAdminSubscriptionPlanRequest } from "@/contracts/admin/subscription-plans";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Cria plano de assinatura administrativo.
 */
export function useCreateAdminSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminSubscriptionPlanRequest) =>
      adminService.createSubscriptionPlan(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.subscriptionPlans.all,
      });
    },
  });
}
