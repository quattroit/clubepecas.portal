import type { GetCitiesResponse } from "@/contracts/cities/responses";
import { api } from "@/lib/api";

/**
 * Catálogo público de cidades.
 * GET /api/v1/cities — apenas ativas por padrão.
 */
export const cityService = {
  /**
   * @param includeInactive quando true, inclui cidades inativas.
   * O padrão da API (parâmetro omitido) continua sendo somente as ativas.
   */
  listCities(includeInactive = false) {
    return api
      .get<GetCitiesResponse>("/api/v1/cities", {
        params: includeInactive ? { includeInactive: true } : undefined,
      })
      .then((response) => response.data);
  },
};
