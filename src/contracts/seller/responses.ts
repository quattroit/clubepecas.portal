import type { AdvertisementCondition } from "@/contracts/common/enums";

export type CreateSellerResponse = {
  id: string;
  storeName: string;
  displayName: string;
};

export type SellerMeDto = {
  id: string;
  storeName: string;
  displayName: string;
  description: string | null;
  cityId: string;
  city: string;
  state: string;
  citySlug: string;
  whatsApp: string;
  instagram: string | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
};

export type PublicSellerAdvertisementDto = {
  slug: string;
  title: string;
  price: number;
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
  thumbnailUrl: string | null;
  publishedAt: string;
};

/** GET /api/v1/sellers/{slug} */
export type SellerPublicProfileResponse = {
  storeName: string;
  displayName: string;
  description: string | null;
  city: string;
  state: string;
  photoUrl: string | null;
  slug: string;
  whatsApp: string;
  instagram: string | null;
  advertisements: PublicSellerAdvertisementDto[];
};
