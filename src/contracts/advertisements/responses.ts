import type {
  AdvertisementCondition,
  AdvertisementStatus,
} from "@/contracts/common/enums";

export type CreateAdvertisementResponse = {
  id: number;
  title: string;
  slug: string;
  price: number;
  stockQuantity: number;
  status: AdvertisementStatus;
  createdAt: string;
};

export type AdvertisementListItemDto = {
  id: number;
  title: string;
  slug: string;
  price: number;
  stockQuantity: number;
  status: AdvertisementStatus;
  condition: AdvertisementCondition;
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
  createdAt: string;
  thumbnailUrl?: string | null;
};

export type GetMyAdvertisementsResponse = {
  items: AdvertisementListItemDto[];
};

export type AdvertisementDetailDto = {
  id: number;
  sellerId: number;
  title: string;
  description: string;
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
  compatibilityDescription?: string | null;
  condition: AdvertisementCondition;
  price: number;
  stockQuantity: number;
  status: AdvertisementStatus;
  slug: string;
  createdAt: string;
  updatedAt: string | null;
};

export type PublicAdvertisementSellerDto = {
  id: number;
  storeName: string;
  displayName: string;
  city: string;
  state: string;
  whatsApp: string;
  instagram: string | null;
  slug: string;
  advertisementCount: number;
  offersLocalDelivery?: boolean;
};

export type PublicAdvertisementPhotoDto = {
  url: string;
  thumbnailUrl?: string | null;
  displayOrder: number;
};

/** GET /api/v1/advertisements/{slug} — público */
export type AdvertisementBySlugResponse = {
  id: number;
  title: string;
  description: string;
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
  compatibilityDescription?: string | null;
  price: number;
  stockQuantity: number;
  status: AdvertisementStatus;
  createdAt: string;
  slug: string;
  seller: PublicAdvertisementSellerDto;
  photos: PublicAdvertisementPhotoDto[];
};

export type DeleteAdvertisementResponse = {
  id: number;
};

export type AdvertisementPhotoDto = {
  id: number;
  advertisementId: number;
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
  id: number;
  displayOrder: number;
  isPrimary: boolean;
};

export type UpdatePhotoOrderResponse = {
  items: UpdatePhotoOrderItemDto[];
};

export type DeletePhotoResponse = {
  id: number;
};

export type SetPrimaryPhotoResponse = {
  id: number;
  advertisementId: number;
  isPrimary: boolean;
};
