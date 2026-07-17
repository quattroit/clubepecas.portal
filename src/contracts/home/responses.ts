/** Resposta de GET /api/v1/home/stats */
export type GetHomeStatsResponse = {
  activeListings: number;
  activeStores: number;
  categories: number;
};
