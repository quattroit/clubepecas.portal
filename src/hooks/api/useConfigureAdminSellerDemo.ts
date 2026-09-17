"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ConfigureAdminSellerDemoRequest } from "@/contracts/admin/sellers";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { isCanceledError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Ativa ou ajusta demonstração personalizada do vendedor.
 */
export function useConfigureAdminSellerDemo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: ConfigureAdminSellerDemoRequest & { id: number }) =>
      adminService.configureSellerDemo(id, payload),
    onSuccess: (data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.sellers.all,
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "sellers", "detail", variables.id],
      });
      toast.success(
        data.created
          ? "Demonstração ativada."
          : "Demonstração atualizada.",
      );
    },
    onError: (error) => {
      if (isCanceledError(error)) return;
      toast.error(getFriendlyErrorMessage(error));
    },
  });
}
