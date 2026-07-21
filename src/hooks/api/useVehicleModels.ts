"use client";

import { useQuery } from "@tanstack/react-query";

import type { GetVehicleModelsParams } from "@/contracts/vehicle-models/responses";
import { mapVehicleModelItemsToVehicleModels } from "@/mappers/vehicle-model.mapper";
import { queryKeys } from "@/lib/queryKeys";
import { vehicleModelService } from "@/services/vehicleModel.service";

type UseVehicleModelsParams = GetVehicleModelsParams;

/**
 * Catálogo público de modelos de veículo (GET /api/v1/vehicle-models).
 * Só busca quando `brandId` ou `brandSlug` é informado (cascade marca → modelo).
 */
export function useVehicleModels(params: UseVehicleModelsParams = {}) {
  const brandId = params.brandId;
  const brandSlug = params.brandSlug?.trim() || undefined;
  const enabled = Boolean(brandId || brandSlug);

  const queryParams: GetVehicleModelsParams = {
    ...(brandId ? { brandId } : {}),
    ...(brandSlug ? { brandSlug } : {}),
    ...(params.includeInactive ? { includeInactive: true } : {}),
  };

  return useQuery({
    queryKey: queryKeys.vehicleModels.list(
      queryParams as Record<string, unknown>,
    ),
    queryFn: async () => {
      const response = await vehicleModelService.listVehicleModels(queryParams);
      return mapVehicleModelItemsToVehicleModels(response.items);
    },
    enabled,
    staleTime: 60_000,
  });
}
