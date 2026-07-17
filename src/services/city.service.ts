import type { GetCitiesResponse } from "@/contracts/cities/responses";
import { api } from "@/lib/api";

/**
 * Catálogo público de cidades.
 * GET /api/v1/cities — apenas ativas por padrão.
 */
export const cityService = {
  listCities() {
    return api
      .get<GetCitiesResponse>("/api/v1/cities")
      .then((response) => response.data);
  },
};
