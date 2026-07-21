"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAdminVehicleModelRequest } from "@/contracts/admin/vehicle-models";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Atualiza modelo de veículo administrativo.
 */
export function useUpdateAdminVehicleModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: UpdateAdminVehicleModelRequest & { id: number }) =>
      adminService.updateVehicleModel(id, payload),
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
