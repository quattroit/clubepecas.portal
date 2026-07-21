"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Dashboard financeiro administrativo (Sprint 8.6).
 */
export function useAdminFinancialDashboard() {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.financial.dashboard,
    queryFn: () => adminService.getFinancialDashboard(),
    enabled: authReady,
    retry: false,
  });
}
