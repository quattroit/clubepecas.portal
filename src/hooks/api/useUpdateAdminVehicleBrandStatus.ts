"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAdminVehicleBrandStatusRequest } from "@/contracts/admin/vehicle-brands";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Ativa ou inativa marca de veículo administrativa.
 */
export function useUpdateAdminVehicleBrandStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: UpdateAdminVehicleBrandStatusRequest & { id: number }) =>
      adminService.updateVehicleBrandStatus(id, payload),
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
