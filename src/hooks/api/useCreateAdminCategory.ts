"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateAdminCategoryRequest } from "@/contracts/admin/categories";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Cria categoria administrativa.
 */
export function useCreateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminCategoryRequest) =>
      adminService.createCategory(payload),
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
