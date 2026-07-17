"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { adminService } from "@/services/admin.service";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

/**
 * Limpeza de arquivos órfãos (dryRun ou remoção real).
 */
export function useCleanupOrphanFiles() {
  return useMutation({
    mutationFn: (dryRun: boolean) => adminService.cleanupOrphanFiles(dryRun),
    onSuccess: (data) => {
      if (data.dryRun) {
        toast.success(
          data.candidates === 0
            ? "Dry run concluído: nenhum órfão encontrado."
            : `Dry run: ${data.candidates} arquivo(s) seriam removidos.`,
        );
        return;
      }

      toast.success(
        data.removed === 0
          ? "Limpeza concluída: nenhum arquivo removido."
          : `Limpeza concluída: ${data.removed} arquivo(s) removido(s).`,
      );
    },
    onError: (error) => {
      toast.error(getFriendlyErrorMessage(error));
    },
  });
}
