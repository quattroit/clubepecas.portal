"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { UpdateAdminRepresentativeRequest } from "@/contracts/admin/representatives";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useUpdateAdminRepresentative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: UpdateAdminRepresentativeRequest & { id: number }) =>
      adminService.updateRepresentative(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.representatives.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.representatives.detail(variables.id),
      });
      toast.success("Representante atualizado.");
    },
  });
}
