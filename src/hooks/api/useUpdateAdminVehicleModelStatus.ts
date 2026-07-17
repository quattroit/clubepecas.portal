"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAdminVehicleModelStatusRequest } from "@/contracts/admin/vehicle-models";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Ativa ou inativa modelo de veículo administrativo.
 */
export function useUpdateAdminVehicleModelStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: UpdateAdminVehicleModelStatusRequest & { id: string }) =>
      adminService.updateVehicleModelStatus(id, payload),
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
