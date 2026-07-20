"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Configurações globais da plataforma.
 */
export function useAdminPlatformSettings() {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.settings,
    queryFn: () => adminService.getPlatformSettings(),
    enabled: authReady,
    retry: false,
  });
}
