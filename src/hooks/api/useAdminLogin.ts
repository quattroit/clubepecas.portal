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
 * Login administrativo — POST /api/v1/auth/admin/login.
 * Invalidação de queries fica a cargo do AuthQuerySync.
 */
export function useAdminLogin() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const response = await authenticationService.adminLogin(payload);
      return mapLoginResponseToSession(response);
    },
    onSuccess: (session) => {
      login(session);
      const next = readAuthNextFromLocation();
      router.replace(
        next?.startsWith("/admin") ? next : ROUTES.ADMIN,
      );
    },
  });
}
