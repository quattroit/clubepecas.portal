"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ChangePasswordRequest } from "@/contracts/authentication/requests";
import { authenticationService } from "@/services/authentication.service";

/**
 * Alteração de senha do usuário autenticado.
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) =>
      authenticationService.changePassword(payload),
    onSuccess: () => {
      toast.success("Senha alterada com sucesso.");
    },
  });
}
