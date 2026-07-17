"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ReorderAdminVehicleModelsRequest } from "@/contracts/admin/vehicle-models";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Reordena modelos de veículo (drag-and-drop) — envia lista completa de ids.
 */
export function useReorderAdminVehicleModels() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReorderAdminVehicleModelsRequest) =>
      adminService.reorderVehicleModels(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.vehicleModels.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.vehicleModels.all,
      });
    },
  });
}
