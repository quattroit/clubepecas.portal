"use client";

import { useQuery } from "@tanstack/react-query";

import type { MetricsPeriodParam } from "@/contracts/admin/dashboard";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Dashboard administrativo consolidado (uma requisição).
 */
export function useAdminDashboard(period: MetricsPeriodParam = "all") {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.dashboard(period),
    queryFn: () => adminService.getDashboard(period),
    enabled: authReady,
    retry: false,
    refetchOnMount: "always",
  });
}
