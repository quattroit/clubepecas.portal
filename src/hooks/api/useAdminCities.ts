"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdminCitiesListParams } from "@/contracts/admin/cities";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Listagem administrativa de cidades (uma requisição — sem paginação).
 */
export function useAdminCities(params: AdminCitiesListParams = {}) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.cities.list(params as Record<string, unknown>),
    queryFn: () => adminService.listCities(params),
    enabled: authReady,
    retry: false,
    placeholderData: (previous) => previous,
  });
}
