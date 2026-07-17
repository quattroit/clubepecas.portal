import type {
  AdvertisementCondition,
  AdvertisementStatus,
} from "@/contracts/common/enums";

export type CreateAdvertisementResponse = {
  id: string;
  title: string;
  slug: string;
  price: number;
  stockQuantity: number;
  status: AdvertisementStatus;
  createdAt: string;
};

export type AdvertisementListItemDto = {
  id: string;
  title: string;
  slug: string;
  price: number;
  stockQuantity: number;
  status: AdvertisementStatus;
  condition: AdvertisementCondition;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  vehicleBrandId: string;
  vehicleBrandName: string;
  vehicleBrandSlug: string;
  vehicleModelId?: string | null;
  vehicleModelName?: string | null;
  vehicleModelSlug?: string | null;
  createdAt: string;
};

export type GetMyAdvertisementsResponse = {
  items: AdvertisementListItemDto[];
};

export type AdvertisementDetailDto = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  vehicleBrandId: string;
  vehicleBrandName: string;
  vehicleBrandSlug: string;
  vehicleModelId?: string | null;
  vehicleModelName?: string | null;
  vehicleModelSlug?: string | null;
  compatibilityDescription: string;
  condition: AdvertisementCondition;
  price: number;
  stockQuantity: number;
  status: AdvertisementStatus;
  slug: string;
  createdAt: string;
  updatedAt: string | null;
};

export type PublicAdvertisementSellerDto = {
  storeName: string;
  displayName: string;
  city: string;
  state: string;
  whatsApp: string;
  instagram: string | null;
  slug: string;
};

export type PublicAdvertisementPhotoDto = {
  url: string;
  displayOrder: number;
};

/** GET /api/v1/advertisements/{slug} — público */
export type AdvertisementBySlugResponse = {
  title: string;
  description: string;
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
  compatibilityDescription: string;
  price: number;
  stockQuantity: number;
  status: AdvertisementStatus;
  createdAt: string;
  slug: string;
  seller: PublicAdvertisementSellerDto;
  photos: PublicAdvertisementPhotoDto[];
};

export type DeleteAdvertisementResponse = {
  id: string;
};

export type AdvertisementPhotoDto = {
  id: string;
  advertisementId: string;
  url: string;
  displayOrder: number;
  createdAt: string;
};

export type GetPhotosResponse = {
  items: AdvertisementPhotoDto[];
};

export type UpdatePhotoOrderItemDto = {
  id: string;
  displayOrder: number;
};

export type UpdatePhotoOrderResponse = {
  items: UpdatePhotoOrderItemDto[];
};

export type DeletePhotoResponse = {
  id: string;
};
