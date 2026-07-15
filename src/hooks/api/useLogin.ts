"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";
import type { LoginRequest } from "@/contracts/authentication/requests";
import { ROUTES } from "@/constants/routes";
import { readAuthNextFromLocation } from "@/lib/announce-flow";
import { mapLoginResponseToSession } from "@/mappers/authentication.mapper";
import { authenticationService } from "@/services/authentication.service";

/**
 * Login real via API + persistência de sessão.
 * Respeita `?next=` (fluxo Anunciar → /painel/anuncios/novo).
 */
export function useLogin() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const response = await authenticationService.login(payload);
      return mapLoginResponseToSession(response);
    },
    onSuccess: (session) => {
      login(session);
      router.replace(readAuthNextFromLocation() ?? ROUTES.DASHBOARD);
    },
  });
}
