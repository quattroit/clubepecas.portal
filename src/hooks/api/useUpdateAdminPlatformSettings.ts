"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { UpdatePlatformSettingsRequest } from "@/contracts/admin/settings";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Atualiza as configurações globais da plataforma.
 */
export function useUpdateAdminPlatformSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePlatformSettingsRequest) =>
      adminService.updatePlatformSettings(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.admin.settings, data);
      toast.success("Configurações salvas com sucesso!");
    },
  });
}
