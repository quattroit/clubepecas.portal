"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAdminSpecialtyStatusRequest } from "@/contracts/admin/specialties";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useUpdateAdminSpecialtyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateAdminSpecialtyStatusRequest;
    }) => adminService.updateSpecialtyStatus(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.specialties.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.specialties.all,
      });
    },
  });
}
