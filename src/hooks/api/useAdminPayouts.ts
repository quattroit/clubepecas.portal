"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdminPayoutsListParams } from "@/contracts/admin/payouts";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/** GET /api/v1/admin/payouts (Sprint 10.7) */
export function useAdminPayouts(params: AdminPayoutsListParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.payouts.list(params as Record<string, unknown>),
    queryFn: () => adminService.listPayouts(params),
  });
}

/** GET /api/v1/admin/payouts/{id} */
export function useAdminPayout(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.payouts.detail(id),
    queryFn: () => adminService.getPayout(id),
    enabled: enabled && id > 0,
  });
}
