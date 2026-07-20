"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";
import type { RegisterUserRequest } from "@/contracts/authentication/requests";
import { ROUTES } from "@/constants/routes";
import { readAuthNextFromLocation } from "@/lib/announce-flow";
import { mapLoginResponseToSession } from "@/mappers/authentication.mapper";
import { authenticationService } from "@/services/authentication.service";

/**
 * Cadastro real via API e login automático em seguida.
 * Respeita `?next=` (fluxo Anunciar → /painel/anuncios/novo).
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
      router.replace(readAuthNextFromLocation() ?? ROUTES.DASHBOARD);
    },
  });
}
