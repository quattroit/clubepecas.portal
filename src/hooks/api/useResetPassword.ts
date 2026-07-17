"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ResetPasswordRequest } from "@/contracts/authentication/requests";
import { authenticationService } from "@/services/authentication.service";

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) =>
      authenticationService.resetPassword(payload),
    onSuccess: () => {
      toast.success("Senha redefinida com sucesso. Faça login com a nova senha.");
    },
  });
}
