import type {
  GetVehicleModelsParams,
  GetVehicleModelsResponse,
} from "@/contracts/vehicle-models/responses";
import { api } from "@/lib/api";

/**
 * Catálogo público de modelos de veículo.
 * GET /api/v1/vehicle-models — apenas ativos por padrão.
 */
export const vehicleModelService = {
  listVehicleModels(params: GetVehicleModelsParams = {}) {
    return api
      .get<GetVehicleModelsResponse>("/api/v1/vehicle-models", {
        params,
      })
      .then((response) => response.data);
  },
};
