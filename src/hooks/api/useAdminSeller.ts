"use client";

import { useQuery } from "@tanstack/react-query";

import type { MetricsPeriodParam } from "@/contracts/admin/sellers";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Detalhes do vendedor + métricas + anúncios (uma requisição).
 */
export function useAdminSeller(
  id: number,
  period: MetricsPeriodParam = "all",
) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.sellers.detail(id, period),
    queryFn: () => adminService.getSeller(id, period),
    enabled: authReady && Boolean(id),
    retry: false,
  });
}
