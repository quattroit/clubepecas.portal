"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAdminSellerStatusRequest } from "@/contracts/admin/sellers";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Ativa ou inativa vendedor.
 */
export function useUpdateAdminSellerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: UpdateAdminSellerStatusRequest & { id: number }) =>
      adminService.updateSellerStatus(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.sellers.all,
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "sellers", "detail", variables.id],
      });
    },
  });
}
