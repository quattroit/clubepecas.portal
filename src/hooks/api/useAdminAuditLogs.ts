"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdminAuditListParams } from "@/contracts/admin/audit";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Listagem paginada de logs de auditoria (uma requisição).
 */
export function useAdminAuditLogs(params: AdminAuditListParams) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.audit.list(params as Record<string, unknown>),
    queryFn: () => adminService.listAuditLogs(params),
    enabled: authReady,
    retry: false,
    placeholderData: (previous) => previous,
  });
}
