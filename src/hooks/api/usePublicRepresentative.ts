"use client";

import { useQuery } from "@tanstack/react-query";

import { representativesService } from "@/services/representatives.service";

export function usePublicRepresentative(
  code: string | null | undefined,
  enabled = true,
) {
  const normalized = code?.trim().toUpperCase() ?? "";

  return useQuery({
    queryKey: ["representatives", "public", normalized],
    queryFn: () => representativesService.getByCode(normalized),
    enabled: enabled && normalized.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
