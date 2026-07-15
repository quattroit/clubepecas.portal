import type { AdvertisementCategory } from "@/contracts/common/enums";

/** Query params de GET /api/v1/marketplace */
export type GetMarketplaceRequest = {
  title?: string;
  category?: AdvertisementCategory;
  city?: string;
  state?: string;
};
