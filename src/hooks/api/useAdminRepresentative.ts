"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useAdminRepresentative(
  id: number,
  enabled = true,
  sellersPage = 1,
  sellersPageSize = 20,
) {
  return useQuery({
    queryKey: [
      ...queryKeys.admin.representatives.detail(id),
      sellersPage,
      sellersPageSize,
    ],
    queryFn: () =>
      adminService.getRepresentative(id, { sellersPage, sellersPageSize }),
    enabled: enabled && id > 0,
  });
}
