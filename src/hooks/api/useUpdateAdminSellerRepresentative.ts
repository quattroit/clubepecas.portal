"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { UpdateAdminSellerRepresentativeRequest } from "@/contracts/admin/sellers";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useUpdateAdminSellerRepresentative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sellerId,
      ...payload
    }: UpdateAdminSellerRepresentativeRequest & { sellerId: number }) =>
      adminService.updateSellerRepresentative(sellerId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.sellers.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.representatives.all,
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "sellers", "detail", variables.sellerId],
      });
      toast.success("Representante atualizado.");
    },
  });
}
