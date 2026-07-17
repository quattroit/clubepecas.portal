"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ReorderAdminVehicleBrandsRequest } from "@/contracts/admin/vehicle-brands";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Reordena marcas de veículo (drag-and-drop) — envia lista completa de ids.
 */
export function useReorderAdminVehicleBrands() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReorderAdminVehicleBrandsRequest) =>
      adminService.reorderVehicleBrands(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.vehicleBrands.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.vehicleBrands.all,
      });
    },
  });
}
