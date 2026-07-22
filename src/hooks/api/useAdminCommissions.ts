"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdminCommissionsListParams } from "@/contracts/admin/commissions";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useAdminCommissions(params: AdminCommissionsListParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.commissions.list(params as Record<string, unknown>),
    queryFn: () => adminService.listCommissions(params),
  });
}

export function useAdminCommission(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.commissions.detail(id),
    queryFn: () => adminService.getCommission(id),
    enabled: enabled && id > 0,
  });
}
