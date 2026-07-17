"use client";

import { useQuery } from "@tanstack/react-query";

import { mapVehicleBrandItemsToVehicleBrands } from "@/mappers/vehicle-brand.mapper";
import { queryKeys } from "@/lib/queryKeys";
import { vehicleBrandService } from "@/services/vehicleBrand.service";

/**
 * Catálogo público de marcas de veículo (GET /api/v1/vehicle-brands).
 */
export function useVehicleBrands() {
  return useQuery({
    queryKey: queryKeys.vehicleBrands.all,
    queryFn: async () => {
      const response = await vehicleBrandService.listVehicleBrands();
      return mapVehicleBrandItemsToVehicleBrands(response.items);
    },
    staleTime: 60_000,
  });
}
