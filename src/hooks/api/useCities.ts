"use client";

import { useQuery } from "@tanstack/react-query";

import { mapCityItemsToCities } from "@/mappers/city.mapper";
import { queryKeys } from "@/lib/queryKeys";
import { cityService } from "@/services/city.service";

/**
 * Catálogo público de cidades (GET /api/v1/cities).
 */
export function useCities() {
  return useQuery({
    queryKey: queryKeys.cities.all,
    queryFn: async () => {
      const response = await cityService.listCities();
      return mapCityItemsToCities(response.items);
    },
    staleTime: 60_000,
  });
}
