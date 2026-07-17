"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdminVehicleModelsListParams } from "@/contracts/admin/vehicle-models";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Listagem administrativa de modelos de veículo (uma requisição — sem paginação).
 */
export function useAdminVehicleModels(
  params: AdminVehicleModelsListParams = {},
) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.vehicleModels.list(
      params as Record<string, unknown>,
    ),
    queryFn: () => adminService.listVehicleModels(params),
    enabled: authReady,
    retry: false,
    placeholderData: (previous) => previous,
  });
}
