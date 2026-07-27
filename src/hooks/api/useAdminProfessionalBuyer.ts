"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useAdminProfessionalBuyer(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.professionalBuyers.detail(id),
    queryFn: () => adminService.getProfessionalBuyer(id),
    enabled: enabled && id > 0,
  });
}
