import type {
  AdvertisementCategory,
  AdvertisementCondition,
} from "@/contracts/common/enums";

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
  city: string;
  state: string;
  whatsApp: string | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
};

export type PublicSellerAdvertisementDto = {
  slug: string;
  title: string;
  price: number;
  category: AdvertisementCategory;
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
  whatsApp: string | null;
  advertisements: PublicSellerAdvertisementDto[];
};
