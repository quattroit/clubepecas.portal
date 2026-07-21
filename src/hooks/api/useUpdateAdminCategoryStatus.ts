"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAdminCategoryStatusRequest } from "@/contracts/admin/categories";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Ativa ou inativa categoria administrativa.
 */
export function useUpdateAdminCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: UpdateAdminCategoryStatusRequest & { id: number }) =>
      adminService.updateCategoryStatus(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.categories.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.categories.all,
      });
    },
  });
}
