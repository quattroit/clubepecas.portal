"use client";

import { useAuth } from "@/components/providers/AuthProvider";

/**
 * Queries autenticadas só devem rodar após a sessão estar hidratada e válida.
 */
export function useAuthQueryEnabled(): boolean {
  const { isAuthenticated, isLoading } = useAuth();
  return isAuthenticated && !isLoading;
}
