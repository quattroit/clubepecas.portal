import type {
  AdvertisementCondition,
  CategoryIconType,
} from "@/contracts/common/enums";

/**
 * Item do catálogo público de categorias.
 * GET /api/v1/categories — CRUD administrativo por trás (Sprint 4.3.6).
 */
export type PublicCategoryListItemDto = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  iconType: CategoryIconType;
  iconValue: string;
  advertisementCount: number;
};

export type GetCategoriesResponse = {
  items: PublicCategoryListItemDto[];
};

/**
 * Item do marketplace público.
 * Categoria identificada por Guid (`categoryId`) — não mais enum.
 */
export type MarketplaceItemDto = {
  slug: string;
  title: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  vehicleBrandId: string;
  vehicleBrandName: string;
  vehicleBrandSlug: string;
  vehicleModelId?: string | null;
  vehicleModelName?: string | null;
  vehicleModelSlug?: string | null;
  condition: AdvertisementCondition;
  cityId: string;
  citySlug: string;
  city: string;
  state: string;
  storeName: string;
  thumbnailUrl: string | null;
  publishedAt: string;
};

export type GetMarketplaceResponse = {
  items: MarketplaceItemDto[];
};
