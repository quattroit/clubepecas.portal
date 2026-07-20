"use client";

import { useQuery } from "@tanstack/react-query";

import type { MetricsPeriodParam } from "@/contracts/admin/analytics";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Analytics administrativo consolidado (uma requisição).
 */
export function useAdminAnalytics(period: MetricsPeriodParam = "all") {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.analytics(period),
    queryFn: () => adminService.getAnalytics(period),
    enabled: authReady,
    retry: false,
  });
}
