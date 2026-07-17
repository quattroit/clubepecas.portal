import type {
  AdvertisementBySlugResponse,
  PublicAdvertisementSellerDto,
} from "@/contracts/advertisements/responses";
import type {
  SellerMeDto,
  SellerPublicProfileResponse,
} from "@/contracts/seller/responses";
import type { Seller } from "@/types/Seller";

export function mapPublicSellerDtoToSeller(
  dto: PublicAdvertisementSellerDto,
): Seller {
  return {
    id: dto.slug,
    slug: dto.slug,
    name: dto.storeName,
    displayName: dto.displayName,
    city: dto.city,
    state: dto.state,
    advertisementCount: 0,
    whatsApp: dto.whatsApp,
    instagram: dto.instagram,
  };
}

export function mapSellerPublicProfileToSeller(
  dto: SellerPublicProfileResponse,
): Seller {
  return {
    id: dto.slug,
    slug: dto.slug,
    name: dto.storeName,
    displayName: dto.displayName,
    city: dto.city,
    state: dto.state,
    advertisementCount: dto.advertisements.length,
    avatarUrl: dto.photoUrl,
    description: dto.description ?? undefined,
    whatsApp: dto.whatsApp,
    instagram: dto.instagram,
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
    avatarUrl: dto.photoUrl,
    description: dto.description ?? undefined,
    registeredAt: dto.createdAt,
    personType: dto.personType,
    document: dto.document,
    whatsApp: dto.whatsApp,
    instagram: dto.instagram,
  };
}

export function mapAdvertisementBySlugSeller(
  dto: AdvertisementBySlugResponse,
): Seller {
  return mapPublicSellerDtoToSeller(dto.seller);
}
