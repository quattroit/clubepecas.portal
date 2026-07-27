"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";
import type { LoginRequest } from "@/contracts/authentication/requests";
import { UserRole } from "@/contracts/common/enums";
import { ROUTES } from "@/constants/routes";
import { readAuthNextFromLocation } from "@/lib/announce-flow";
import { mapLoginResponseToSession } from "@/mappers/authentication.mapper";
import { authenticationService } from "@/services/authentication.service";

/**
 * Login real via API + persistência de sessão.
 * Respeita `?next=` (fluxo Anunciar → /painel/anuncios/novo).
 * Redireciona por role: ProfessionalBuyer → /comprador, Admin → /admin, Seller → painel.
 * Invalidação de queries fica a cargo do AuthQuerySync.
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
      const next = readAuthNextFromLocation();

      if (session.role === UserRole.ProfessionalBuyer) {
        router.replace(
          next?.startsWith("/comprador") ? next : ROUTES.PROFESSIONAL_BUYER,
        );
        return;
      }

      if (session.role === UserRole.Administrator) {
        router.replace(next?.startsWith("/admin") ? next : ROUTES.ADMIN);
        return;
      }

      router.replace(next?.startsWith("/painel") ? next : ROUTES.DASHBOARD);
    },
  });
}
