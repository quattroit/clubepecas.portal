"use client";

import { useRepresentativeAuth } from "@/components/providers/RepresentativeAuthProvider";

/**
 * Queries autenticadas do representante só devem rodar após a sessão
 * estar hidratada e válida.
 */
export function useRepresentativeAuthQueryEnabled(): boolean {
  const { isAuthenticated, isLoading } = useRepresentativeAuth();
  return isAuthenticated && !isLoading;
}
