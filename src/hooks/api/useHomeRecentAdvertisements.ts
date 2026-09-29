"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { mapMarketplaceItemToAdvertisement } from "@/mappers/advertisement.mapper";
import { homeService } from "@/services/home.service";

/**
 * Anúncios recentes da Home (GET /api/v1/home/recent-advertisements).
 * Backend busca os 40 mais recentes e sorteia 4 a cada chamada.
 */
export function useHomeRecentAdvertisements() {
  return useQuery({
    queryKey: queryKeys.home.recentAdvertisements,
    queryFn: async () => {
      const response = await homeService.getRecentAdvertisements();
      return (response.items ?? []).map(mapMarketplaceItemToAdvertisement);
    },
    // Sem cache: cada acesso à Home deve receber um novo sorteio.
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });
}
