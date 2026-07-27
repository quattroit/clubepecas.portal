"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { professionalBuyerService } from "@/services/professional-buyer.service";

export function useMyProfessionalBuyer(enabled = true) {
  return useQuery({
    queryKey: queryKeys.professionalBuyers.me,
    queryFn: () => professionalBuyerService.getMe(),
    enabled,
  });
}
