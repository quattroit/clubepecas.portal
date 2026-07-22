"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useAdminRepresentative(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.representatives.detail(id),
    queryFn: () => adminService.getRepresentative(id),
    enabled: enabled && id > 0,
  });
}
