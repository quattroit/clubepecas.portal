"use client";

import { useMutation } from "@tanstack/react-query";

import type { RegisterUserRequest } from "@/contracts/authentication/requests";
import { authenticationService } from "@/services/authentication.service";

/**
 * Cadastro via API. A conta permanece sem sessão até o e-mail ser confirmado.
 */
export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterUserRequest) =>
      authenticationService.register(payload),
  });
}
