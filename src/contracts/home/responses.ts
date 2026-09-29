import type { MarketplaceItemDto } from "@/contracts/categories/responses";

/** Resposta de GET /api/v1/home/stats */
export type GetHomeStatsResponse = {
  activeListings: number;
  activeStores: number;
  categories: number;
};

/** Resposta de GET /api/v1/home/recent-advertisements */
export type GetHomeRecentAdvertisementsResponse = {
  items: MarketplaceItemDto[];
};
