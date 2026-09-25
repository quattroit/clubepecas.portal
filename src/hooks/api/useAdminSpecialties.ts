"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdminSpecialtiesListParams } from "@/contracts/admin/specialties";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useAdminSpecialties(params: AdminSpecialtiesListParams = {}) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.specialties.list(
      params as Record<string, unknown>,
    ),
    queryFn: () => adminService.listSpecialties(params),
    enabled: authReady,
    retry: false,
    placeholderData: (previous) => previous,
  });
}
