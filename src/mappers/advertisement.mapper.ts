import type {
  AdvertisementBySlugResponse,
  AdvertisementListItemDto,
} from "@/contracts/advertisements/responses";
import type { MarketplaceItemDto } from "@/contracts/categories/responses";
import type { PublicSellerAdvertisementDto } from "@/contracts/seller/responses";
import { getStatusLabel, isNewCondition } from "@/mappers/categoryMeta";
import type { Advertisement } from "@/types/Advertisement";

export function mapMarketplaceItemToAdvertisement(
  item: MarketplaceItemDto,
): Advertisement {
  return {
    id: item.slug,
    slug: item.slug,
    title: item.title,
    price: item.price,
    stockQuantity: item.stockQuantity,
    cityId: item.cityId,
    citySlug: item.citySlug,
    city: item.city,
    state: item.state,
    category: item.categoryName,
    categoryId: item.categoryId,
    categorySlug: item.categorySlug,
    vehicleBrand: item.vehicleBrandName,
    vehicleBrandId: item.vehicleBrandId,
    vehicleBrandSlug: item.vehicleBrandSlug,
    vehicleModel: item.vehicleModelName ?? undefined,
    vehicleModelId: item.vehicleModelId ?? undefined,
    vehicleModelSlug: item.vehicleModelSlug ?? undefined,
    imageUrl: item.thumbnailUrl,
    images: item.thumbnailUrl ? [item.thumbnailUrl] : [],
    isNew: isNewCondition(item.condition),
    publishedAt: item.publishedAt,
  };
}

export function mapAdvertisementBySlugToAdvertisement(
  dto: AdvertisementBySlugResponse,
): Advertisement {
  const photos = [...dto.photos].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const images = photos.map((photo) => photo.url);

  return {
    id: dto.slug,
    slug: dto.slug,
    title: dto.title,
    price: dto.price,
    stockQuantity: dto.stockQuantity,
    city: dto.seller.city,
    state: dto.seller.state,
    category: dto.categoryName,
    categoryId: dto.categoryId,
    categorySlug: dto.categorySlug,
    vehicleBrand: dto.vehicleBrandName,
    vehicleBrandId: dto.vehicleBrandId,
    vehicleBrandSlug: dto.vehicleBrandSlug,
    vehicleModel: dto.vehicleModelName ?? undefined,
    vehicleModelId: dto.vehicleModelId ?? undefined,
    vehicleModelSlug: dto.vehicleModelSlug ?? undefined,
    imageUrl: images[0] ?? null,
    images,
    isNew: isNewCondition(dto.condition),
    description: dto.description,
    publishedAt: dto.createdAt,
    compatibilityDescription: dto.compatibilityDescription,
  };
}

export function mapPublicSellerAdvertisementToAdvertisement(
  item: PublicSellerAdvertisementDto,
  location: { city: string; state: string },
): Advertisement {
  return {
    id: item.slug,
    slug: item.slug,
    title: item.title,
    price: item.price,
    city: location.city,
    state: location.state,
    category: item.categoryName,
    categoryId: item.categoryId,
    categorySlug: item.categorySlug,
    vehicleBrand: item.vehicleBrandName,
    vehicleBrandId: item.vehicleBrandId,
    vehicleBrandSlug: item.vehicleBrandSlug,
    vehicleModel: item.vehicleModelName ?? undefined,
    vehicleModelId: item.vehicleModelId ?? undefined,
    vehicleModelSlug: item.vehicleModelSlug ?? undefined,
    imageUrl: item.thumbnailUrl,
    images: item.thumbnailUrl ? [item.thumbnailUrl] : [],
    isNew: isNewCondition(item.condition),
    publishedAt: item.publishedAt,
  };
}

export function mapMyAdvertisementItemToAdvertisement(
  item: AdvertisementListItemDto,
  options?: { imageUrl?: string | null },
): Advertisement {
  const imageUrl = options?.imageUrl ?? null;

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    price: item.price,
    stockQuantity: item.stockQuantity,
    // Listagem "me" não devolve localização do vendedor
    city: "",
    state: "",
    category: item.categoryName,
    categoryId: item.categoryId,
    categorySlug: item.categorySlug,
    vehicleBrand: item.vehicleBrandName,
    vehicleBrandId: item.vehicleBrandId,
    vehicleBrandSlug: item.vehicleBrandSlug,
    vehicleModel: item.vehicleModelName ?? undefined,
    vehicleModelId: item.vehicleModelId ?? undefined,
    vehicleModelSlug: item.vehicleModelSlug ?? undefined,
    imageUrl,
    images: imageUrl ? [imageUrl] : [],
    isNew: isNewCondition(item.condition),
    publishedAt: item.createdAt,
    statusLabel: getStatusLabel(item.status),
    // updatedAt existe só no detalhe — listagem não fornece
    updatedAt: null,
  };
}

/**
 * Relacionados a partir do marketplace (excluindo o anúncio atual).
 */
export function mapRelatedMarketplaceItems(
  items: MarketplaceItemDto[],
  currentSlug: string,
  limit = 4,
): Advertisement[] {
  return items
    .filter((item) => item.slug !== currentSlug)
    .slice(0, limit)
    .map(mapMarketplaceItemToAdvertisement);
}
