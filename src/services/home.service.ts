import type {
  GetHomeRecentAdvertisementsResponse,
  GetHomeStatsResponse,
} from "@/contracts/home/responses";
import { api } from "@/lib/api";

/**
 * Dados públicos da Home.
 */
export const homeService = {
  getStats() {
    return api
      .get<GetHomeStatsResponse>("/api/v1/home/stats")
      .then((response) => response.data);
  },

  getRecentAdvertisements() {
    return api
      .get<GetHomeRecentAdvertisementsResponse>(
        "/api/v1/home/recent-advertisements",
      )
      .then((response) => response.data);
  },
};
