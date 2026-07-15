import type {
  AdvertisementCategory,
  AdvertisementCondition,
} from "@/contracts/common/enums";

/**
 * Item do marketplace público.
 * Categorias no backend são o enum AdvertisementCategory (não há CRUD de categorias).
 */
export type MarketplaceItemDto = {
  slug: string;
  title: string;
  price: number;
  category: AdvertisementCategory;
  condition: AdvertisementCondition;
  city: string;
  state: string;
  storeName: string;
  thumbnailUrl: string | null;
  publishedAt: string;
};

export type GetMarketplaceResponse = {
  items: MarketplaceItemDto[];
};
