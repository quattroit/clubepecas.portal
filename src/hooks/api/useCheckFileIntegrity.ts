"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

/**
 * Executa verificação de integridade do armazenamento.
 */
export function useCheckFileIntegrity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminService.checkFileIntegrity(),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.admin.files.integrity, data);
      toast.success("Verificação de integridade concluída.");
    },
    onError: (error) => {
      toast.error(getFriendlyErrorMessage(error));
    },
  });
}
