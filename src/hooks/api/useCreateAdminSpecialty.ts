"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateAdminSpecialtyRequest } from "@/contracts/admin/specialties";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useCreateAdminSpecialty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminSpecialtyRequest) =>
      adminService.createSpecialty(payload),
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
