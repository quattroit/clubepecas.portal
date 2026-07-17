"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateAdminVehicleModelRequest } from "@/contracts/admin/vehicle-models";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Cria modelo de veículo administrativo.
 */
export function useCreateAdminVehicleModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminVehicleModelRequest) =>
      adminService.createVehicleModel(payload),
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
