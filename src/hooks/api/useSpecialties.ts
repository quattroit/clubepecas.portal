"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { specialtyService } from "@/services/specialty.service";

/**
 * Catálogo público de especialidades (GET /api/v1/specialties).
 */
export function useSpecialties() {
  return useQuery({
    queryKey: queryKeys.specialties.all,
    queryFn: async () => {
      const response = await specialtyService.listSpecialties();
      return response.items;
    },
    staleTime: 60_000,
  });
}
