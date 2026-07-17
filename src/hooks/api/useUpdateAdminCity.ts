"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAdminCityRequest } from "@/contracts/admin/cities";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Atualiza cidade administrativa.
 */
export function useUpdateAdminCity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: UpdateAdminCityRequest & { id: string }) =>
      adminService.updateCity(id, payload),
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
