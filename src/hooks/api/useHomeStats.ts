"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { mapHomeStatsDto } from "@/mappers/home-stats.mapper";
import { homeService } from "@/services/home.service";

const HOME_STATS_STALE_MS = 5 * 60_000; // 5 min — mudam pouco

/**
 * Indicadores do Hero (GET /api/v1/home/stats).
 */
export function useHomeStats() {
  return useQuery({
    queryKey: queryKeys.home.stats,
    queryFn: async () => {
      const dto = await homeService.getStats();
      return mapHomeStatsDto(dto);
    },
    staleTime: HOME_STATS_STALE_MS,
    // Falha não derruba a Home — componente consome isError e omite/usar zeros.
    retry: 1,
  });
}
