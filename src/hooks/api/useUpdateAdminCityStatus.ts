"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAdminCityStatusRequest } from "@/contracts/admin/cities";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Ativa ou inativa cidade administrativa.
 */
export function useUpdateAdminCityStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: UpdateAdminCityStatusRequest & { id: string }) =>
      adminService.updateCityStatus(id, payload),
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
