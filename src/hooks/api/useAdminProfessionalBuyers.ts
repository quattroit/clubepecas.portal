"use client";

import { useQuery } from "@tanstack/react-query";

import type { ListProfessionalBuyersParams } from "@/contracts/professional-buyers";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export function useAdminProfessionalBuyers(
  params: ListProfessionalBuyersParams = {},
) {
  return useQuery({
    queryKey: queryKeys.admin.professionalBuyers.list(params),
    queryFn: () => adminService.listProfessionalBuyers(params),
  });
}
