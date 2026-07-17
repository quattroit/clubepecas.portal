import type { GetHomeStatsResponse } from "@/contracts/home/responses";
import { api } from "@/lib/api";

/**
 * Indicadores públicos da Home.
 */
export const homeService = {
  getStats() {
    return api
      .get<GetHomeStatsResponse>("/api/v1/home/stats")
      .then((response) => response.data);
  },
};
