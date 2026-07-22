"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { RepresentativeResetPasswordRequest } from "@/contracts/representative/auth";
import { representativeAuthService } from "@/services/representative-auth.service";

export function useRepresentativeResetPassword() {
  return useMutation({
    mutationFn: (payload: RepresentativeResetPasswordRequest) =>
      representativeAuthService.resetPassword(payload),
    onSuccess: () => {
      toast.success("Senha redefinida com sucesso. Faça login com a nova senha.");
    },
  });
}
