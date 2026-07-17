"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Detalhe de um plano de assinatura administrativo.
 */
export function useAdminSubscriptionPlan(id: string | undefined) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.subscriptionPlans.detail(id ?? ""),
    queryFn: () => adminService.getSubscriptionPlan(id!),
    enabled: authReady && Boolean(id),
    retry: false,
  });
}
