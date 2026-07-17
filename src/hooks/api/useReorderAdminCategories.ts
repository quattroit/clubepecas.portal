"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ReorderAdminCategoriesRequest } from "@/contracts/admin/categories";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Reordena categorias (drag-and-drop) — envia lista completa de ids.
 */
export function useReorderAdminCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReorderAdminCategoriesRequest) =>
      adminService.reorderCategories(payload),
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
