import type { GetVehicleBrandsResponse } from "@/contracts/vehicle-brands/responses";
import { api } from "@/lib/api";

/**
 * Catálogo público de marcas de veículo.
 * GET /api/v1/vehicle-brands — apenas ativas por padrão.
 */
export const vehicleBrandService = {
  listVehicleBrands() {
    return api
      .get<GetVehicleBrandsResponse>("/api/v1/vehicle-brands")
      .then((response) => response.data);
  },
};
