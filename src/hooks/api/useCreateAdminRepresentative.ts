"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CreateAdminRepresentativeRequest } from "@/contracts/admin/representatives";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useCreateAdminRepresentative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminRepresentativeRequest) =>
      adminService.createRepresentative(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.representatives.all,
      });
      toast.success("Representante cadastrado.");
    },
  });
}
