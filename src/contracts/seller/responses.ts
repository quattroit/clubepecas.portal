import type { AdvertisementCondition } from "@/contracts/common/enums";
import type { PersonType } from "@/contracts/common/enums";

export type CreateSellerResponse = {
  id: number;
  storeName: string;
  displayName: string;
};

export type SellerMeDto = {
  id: number;
  storeName: string;
  displayName: string;
  description: string | null;
  cityId: number;
  city: string;
  state: string;
  citySlug: string;
  personType: PersonType | null;
  document: string | null;
  whatsApp: string;
  instagram: string | null;
  photoUrl: string | null;
  zipCode: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  isActive: boolean;
  createdAt: string;
  representativeId?: number | null;
  representativeCode?: string | null;
  representativeName?: string | null;
  representativeStatus?: number | null;
  representativeStatusLabel?: string | null;
};

export type PublicSellerAdvertisementDto = {
  id: number;
  slug: string;
  title: string;
  price: number;
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
