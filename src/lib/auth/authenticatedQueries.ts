import type { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";

/**
 * Invalida dados do painel após login — evita cache vazio/erro de sessão anterior.
 */
export async function invalidateAuthenticatedQueries(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.seller.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.advertisements.me }),
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.me }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.all }),
  ]);
}

/**
 * Remove cache autenticado no logout.
 */
export function removeAuthenticatedQueries(queryClient: QueryClient): void {
  queryClient.removeQueries({ queryKey: queryKeys.seller.all });
  queryClient.removeQueries({ queryKey: queryKeys.advertisements.me });
  queryClient.removeQueries({ queryKey: queryKeys.auth.me });
  queryClient.removeQueries({ queryKey: queryKeys.admin.all });
}

/**
 * Sessão do representante é independente — invalidação/limpeza própria
 * evita misturar cache com vendedor/admin (Sprint 10.6).
 */
export async function invalidateRepresentativeAuthenticatedQueries(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: queryKeys.representative.all });
}

export function removeRepresentativeAuthenticatedQueries(
  queryClient: QueryClient,
): void {
  queryClient.removeQueries({ queryKey: queryKeys.representative.all });
}
