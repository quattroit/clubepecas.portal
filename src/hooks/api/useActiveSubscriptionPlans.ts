"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { subscriptionPlanService } from "@/services/subscriptionPlan.service";

/** Catálogo público de planos ativos (modal Escolher Plano). */
export function useActiveSubscriptionPlans(enabled = true) {
  return useQuery({
    queryKey: queryKeys.subscriptionPlans.all,
    enabled,
    queryFn: async () => {
      const response = await subscriptionPlanService.listActive();
      return response.items;
    },
  });
}
