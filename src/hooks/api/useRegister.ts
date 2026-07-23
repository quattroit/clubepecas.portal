"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";
import type { RegisterUserRequest } from "@/contracts/authentication/requests";
import { mapLoginResponseToSession } from "@/mappers/authentication.mapper";
import { SELLER_ONBOARDING_PROFILE_PATH } from "@/lib/seller-onboarding";
import { authenticationService } from "@/services/authentication.service";

/**
 * Cadastro real via API e login automático em seguida.
 * Sempre inicia pelo perfil da loja (onboarding obrigatório).
 * Invalidação de queries fica a cargo do AuthQuerySync.
 */
export function useRegister() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: RegisterUserRequest) => {
      await authenticationService.register(payload);
      const loginResponse = await authenticationService.login({
        email: payload.email,
        password: payload.password,
      });
      return mapLoginResponseToSession(loginResponse);
    },
    onSuccess: (session) => {
      login(session);
      router.replace(SELLER_ONBOARDING_PROFILE_PATH);
    },
  });
}
