import type {
  AdvertisementBySlugResponse,
  PublicAdvertisementSellerDto,
} from "@/contracts/advertisements/responses";
import type {
  SellerMeDto,
  SellerPublicListItemDto,
  SellerPublicProfileResponse,
} from "@/contracts/seller/responses";
import { resolveMediaUrl } from "@/lib/photo-url";
import type { Seller } from "@/types/Seller";

function resolveSellerPhotoUrl(photoUrl: string | null | undefined): string | null {
  const resolved = resolveMediaUrl(photoUrl);
  return resolved || null;
}

export function mapPublicSellerDtoToSeller(
  dto: PublicAdvertisementSellerDto,
): Seller {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.storeName,
    displayName: dto.displayName,
    city: dto.city,
    state: dto.state,
    advertisementCount: dto.advertisementCount ?? 0,
    whatsApp: dto.whatsApp,
    instagram: dto.instagram,
    offersLocalDelivery: Boolean(dto.offersLocalDelivery),
    localDeliveryMaxRadiusKm: dto.localDeliveryMaxRadiusKm ?? null,
  };
}

export function mapSellerPublicListItemToSeller(
  dto: SellerPublicListItemDto,
): Seller {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.storeName,
    displayName: dto.displayName,
    cityId: dto.cityId,
    city: dto.city,
    state: dto.state,
    citySlug: dto.citySlug,
    advertisementCount: dto.advertisementCount,
    avatarUrl: resolveSellerPhotoUrl(dto.photoUrl),
    description: dto.description ?? undefined,
    whatsApp: dto.whatsApp,
    instagram: dto.instagram,
  };
}

export function mapSellerPublicProfileToSeller(
  dto: SellerPublicProfileResponse,
): Seller {
  return {
    id: 0,
    slug: dto.slug,
    name: dto.storeName,
    displayName: dto.displayName,
    city: dto.city,
    state: dto.state,
    advertisementCount: dto.advertisements.length,
    avatarUrl: resolveSellerPhotoUrl(dto.photoUrl),
    coverUrl: resolveSellerPhotoUrl(dto.coverUrl),
    description: dto.description ?? undefined,
    whatsApp: dto.whatsApp,
    instagram: dto.instagram,
    offersLocalDelivery: Boolean(dto.offersLocalDelivery),
    localDeliveryMaxRadiusKm: dto.localDeliveryMaxRadiusKm ?? null,
    registeredAt: dto.createdAt,
  };
}

export function mapSellerMeToSeller(dto: SellerMeDto): Seller {
  return {
    id: dto.id,
    slug: "",
    name: dto.storeName,
    displayName: dto.displayName,
    cityId: dto.cityId,
    city: dto.city,
    state: dto.state,
    citySlug: dto.citySlug,
    advertisementCount: 0,
    avatarUrl: resolveSellerPhotoUrl(dto.photoUrl),
    coverUrl: resolveSellerPhotoUrl(dto.coverUrl),
    description: dto.description ?? undefined,
    registeredAt: dto.createdAt,
    personType: dto.personType,
    document: dto.document,
    whatsApp: dto.whatsApp,
    instagram: dto.instagram,
    zipCode: dto.zipCode,
    street: dto.street,
    number: dto.number,
    complement: dto.complement,
    neighborhood: dto.neighborhood,
    representativeId: dto.representativeId,
    representativeCode: dto.representativeCode,
    representativeName: dto.representativeName,
    representativeStatus: dto.representativeStatus,
    representativeStatusLabel: dto.representativeStatusLabel,
    demoAlreadyUsed: Boolean(dto.demoAlreadyUsed),
  };
}

export function mapAdvertisementBySlugSeller(
  dto: AdvertisementBySlugResponse,
): Seller {
  return mapPublicSellerDtoToSeller(dto.seller);
}
