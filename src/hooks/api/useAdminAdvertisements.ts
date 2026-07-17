"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdminAdvertisementsListParams } from "@/contracts/admin/advertisements";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Listagem paginada de anúncios administrativos (uma requisição).
 */
export function useAdminAdvertisements(params: AdminAdvertisementsListParams) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.advertisements.list(
      params as Record<string, unknown>,
    ),
    queryFn: () => adminService.listAdvertisements(params),
    enabled: authReady,
    retry: false,
    placeholderData: (previous) => previous,
  });
}
