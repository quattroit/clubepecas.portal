"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdminRepresentativesListParams } from "@/contracts/admin/representatives";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useAdminRepresentatives(
  params: AdminRepresentativesListParams = {},
) {
  return useQuery({
    queryKey: queryKeys.admin.representatives.list(params),
    queryFn: () => adminService.listRepresentatives(params),
  });
}
