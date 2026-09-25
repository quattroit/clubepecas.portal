"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAdminSpecialtyRequest } from "@/contracts/admin/specialties";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useUpdateAdminSpecialty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: UpdateAdminSpecialtyRequest & { id: number }) =>
      adminService.updateSpecialty(id, payload),
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
