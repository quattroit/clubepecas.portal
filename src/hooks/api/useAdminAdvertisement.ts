"use client";

import { useQuery } from "@tanstack/react-query";

import type { MetricsPeriodParam } from "@/contracts/admin/advertisements";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Detalhes do anúncio + métricas (uma requisição).
 */
export function useAdminAdvertisement(
  id: number,
  period: MetricsPeriodParam = "all",
) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.advertisements.detail(id, period),
    queryFn: () => adminService.getAdvertisement(id, period),
    enabled: authReady && Boolean(id),
    retry: false,
  });
}
