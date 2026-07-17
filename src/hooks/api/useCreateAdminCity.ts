"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateAdminCityRequest } from "@/contracts/admin/cities";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Cria cidade administrativa.
 */
export function useCreateAdminCity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminCityRequest) =>
      adminService.createCity(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.cities.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.cities.all,
      });
    },
  });
}
