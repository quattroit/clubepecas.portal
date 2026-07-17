"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { authenticationService } from "@/services/authentication.service";

/**
 * Usuário autenticado (GET /auth/me).
 */
export function useCurrentUser() {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.auth.me,
    enabled: authReady,
    queryFn: () => authenticationService.me(),
  });
}
