"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ReorderAdminCitiesRequest } from "@/contracts/admin/cities";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Reordena cidades (drag-and-drop) — envia lista completa de ids.
 */
export function useReorderAdminCities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReorderAdminCitiesRequest) =>
      adminService.reorderCities(payload),
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
