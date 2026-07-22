"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { useRepresentativeAuth } from "@/components/providers/RepresentativeAuthProvider";
import type { RepresentativeLoginRequest } from "@/contracts/representative/auth";
import { ROUTES } from "@/constants/routes";
import { mapRepresentativeLoginResponseToSession } from "@/mappers/representative-authentication.mapper";
import { representativeAuthService } from "@/services/representative-auth.service";

function getSafeRepresentativeNextPath(next: string | null): string | null {
  if (!next) return null;
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  if (next === ROUTES.REPRESENTATIVE || next.startsWith(`${ROUTES.REPRESENTATIVE}/`)) {
    return next;
  }
  return null;
}

/**
 * Login do portal do representante — POST /api/v1/representative-auth/login.
 * Sessão própria (`clubepecas.representative.auth.session`), independente
 * de vendedor/admin.
 */
export function useRepresentativeLogin() {
  const { login } = useRepresentativeAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: async (payload: RepresentativeLoginRequest) => {
      const response = await representativeAuthService.login(payload);
      return mapRepresentativeLoginResponseToSession(response);
    },
    onSuccess: (session) => {
      login(session);
      const next = getSafeRepresentativeNextPath(searchParams.get("next"));
      router.replace(next ?? ROUTES.REPRESENTATIVE);
    },
  });
}
