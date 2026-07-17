"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAdminCategoryRequest } from "@/contracts/admin/categories";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Atualiza categoria administrativa.
 */
export function useUpdateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: UpdateAdminCategoryRequest & { id: string }) =>
      adminService.updateCategory(id, payload),
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
