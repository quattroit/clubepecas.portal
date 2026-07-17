"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAdminAdvertisementStatusRequest } from "@/contracts/admin/advertisements";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Ativa (Published) ou inativa (Paused) anúncio.
 */
export function useUpdateAdminAdvertisementStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: UpdateAdminAdvertisementStatusRequest & { id: string }) =>
      adminService.updateAdvertisementStatus(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.advertisements.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.dashboard("all"),
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "advertisements", "detail", variables.id],
      });
    },
  });
}
