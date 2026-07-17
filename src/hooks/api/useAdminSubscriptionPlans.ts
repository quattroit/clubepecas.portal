"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Listagem administrativa de planos de assinatura (uma requisição — sem paginação).
 */
export function useAdminSubscriptionPlans() {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.subscriptionPlans.list({}),
    queryFn: () => adminService.listSubscriptionPlans(),
    enabled: authReady,
    retry: false,
    placeholderData: (previous) => previous,
  });
}
