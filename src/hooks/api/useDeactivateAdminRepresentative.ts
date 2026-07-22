"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useDeactivateAdminRepresentative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminService.deactivateRepresentative(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.representatives.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.representatives.detail(id),
      });
      toast.success("Representante inativado.");
    },
  });
}
