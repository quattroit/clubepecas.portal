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
  manufacturingYear: number;
  modelYear: number;
  createdAt: string;
  thumbnailUrl?: string | null;
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
  manufacturingYear: number;
  modelYear: number;
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
  thumbnailUrl?: string | null;
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
  manufacturingYear: number;
  modelYear: number;
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
  storageKey?: string | null;
  publicUrl: string;
  thumbnailStorageKey?: string | null;
  thumbnailPublicUrl?: string | null;
  contentType?: string | null;
  fileSize?: number | null;
  width?: number | null;
  height?: number | null;
  checksum?: string | null;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
};

export type GetPhotosResponse = {
  items: AdvertisementPhotoDto[];
  maxPhotos: number;
  usedCount: number;
  remaining: number;
  maxFileSizeMB: number;
};

export type UpdatePhotoOrderItemDto = {
  id: string;
  displayOrder: number;
  isPrimary: boolean;
};

export type UpdatePhotoOrderResponse = {
  items: UpdatePhotoOrderItemDto[];
};

export type DeletePhotoResponse = {
  id: string;
};

export type SetPrimaryPhotoResponse = {
  id: string;
  advertisementId: string;
  isPrimary: boolean;
};
