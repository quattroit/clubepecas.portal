"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { UpdateRepresentativeMePasswordRequest } from "@/contracts/representative/portal";
import { representativePortalService } from "@/services/representative-portal.service";

/**
 * Alteração de senha do representante autenticado.
 */
export function useChangeRepresentativePassword() {
  return useMutation({
    mutationFn: (payload: UpdateRepresentativeMePasswordRequest) =>
      representativePortalService.changePassword(payload),
    onSuccess: () => {
      toast.success("Senha alterada com sucesso.");
    },
  });
}
