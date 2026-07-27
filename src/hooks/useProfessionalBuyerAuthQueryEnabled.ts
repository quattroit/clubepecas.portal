"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { UserRole } from "@/contracts/common/enums";

/**
 * Queries autenticadas do comprador profissional só devem rodar após a sessão
 * estar hidratada e válida.
 */
export function useProfessionalBuyerAuthQueryEnabled(): boolean {
  const { isAuthenticated, isLoading, user } = useAuth();
  return (
    isAuthenticated &&
    !isLoading &&
    user?.role === UserRole.ProfessionalBuyer
  );
}
