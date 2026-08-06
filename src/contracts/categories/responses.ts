import type {
  AdvertisementCondition,
  CategoryIconType,
  VehicleRequirement,
} from "@/contracts/common/enums";

/**
 * Item do catálogo público de categorias.
 * GET /api/v1/categories — CRUD administrativo por trás (Sprint 4.3.6).
 * Configuração de campos vem da raiz (filhas herdam via parentId).
 */
export type PublicCategoryListItemDto = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  iconType: CategoryIconType;
  iconValue: string;
  advertisementCount: number;
  parentId: number | null;
  vehicleRequirement: VehicleRequirement;
  showCompatibility: boolean;
  allowProfessionalRequest: boolean;
  searchKeywords?: string | null;
  /** Subcategorias aninhadas (GET /categories retorna árvore nas raízes). */
  children?: PublicCategoryListItemDto[];
};

export type GetCategoriesResponse = {
  items: PublicCategoryListItemDto[];
};

/**
 * Item do marketplace público.
 * Categoria identificada por Guid (`categoryId`) — não mais enum.
 */
export type MarketplaceItemDto = {
  id: number;
  slug: string;
  title: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  vehicleBrandId?: number | null;
  vehicleBrandName?: string | null;
  vehicleBrandSlug?: string | null;
  vehicleModelId?: number | null;
  vehicleModelName?: string | null;
  vehicleModelSlug?: string | null;
  manufacturingYear?: number | null;
  modelYear?: number | null;
  condition: AdvertisementCondition;
  cityId: number;
  citySlug: string;
  city: string;
  state: string;
  storeName: string;
  sellerId: number;
  thumbnailUrl: string | null;
  publishedAt: string;
};

export type GetMarketplaceResponse = {
  items: MarketplaceItemDto[];
};
