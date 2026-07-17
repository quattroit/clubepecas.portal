"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdminVehicleBrandsListParams } from "@/contracts/admin/vehicle-brands";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Listagem administrativa de marcas de veículo (uma requisição — sem paginação).
 */
export function useAdminVehicleBrands(
  params: AdminVehicleBrandsListParams = {},
) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.vehicleBrands.list(
      params as Record<string, unknown>,
    ),
    queryFn: () => adminService.listVehicleBrands(params),
    enabled: authReady,
    retry: false,
    placeholderData: (previous) => previous,
  });
}
