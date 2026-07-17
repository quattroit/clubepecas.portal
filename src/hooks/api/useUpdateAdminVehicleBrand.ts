"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAdminVehicleBrandRequest } from "@/contracts/admin/vehicle-brands";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Atualiza marca de veículo administrativa.
 */
export function useUpdateAdminVehicleBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: UpdateAdminVehicleBrandRequest & { id: string }) =>
      adminService.updateVehicleBrand(id, payload),
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
