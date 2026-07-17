"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdminSellersListParams } from "@/contracts/admin/sellers";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Listagem paginada de vendedores (uma requisição).
 */
export function useAdminSellers(params: AdminSellersListParams) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.sellers.list(params as Record<string, unknown>),
    queryFn: () => adminService.listSellers(params),
    enabled: authReady,
    retry: false,
    placeholderData: (previous) => previous,
  });
}
