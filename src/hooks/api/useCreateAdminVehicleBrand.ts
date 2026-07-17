"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateAdminVehicleBrandRequest } from "@/contracts/admin/vehicle-brands";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Cria marca de veículo administrativa.
 */
export function useCreateAdminVehicleBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminVehicleBrandRequest) =>
      adminService.createVehicleBrand(payload),
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
