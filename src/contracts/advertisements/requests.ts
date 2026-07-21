import type { AdvertisementCondition } from "@/contracts/common/enums";

export type CreateAdvertisementRequest = {
  title: string;
  description: string;
  categoryId: number;
  vehicleBrandId: number | null;
  vehicleModelId: number | null;
  manufacturingYear: number | null;
  modelYear: number | null;
  compatibilityDescription: string | null;
  condition: AdvertisementCondition;
  price: number;
  stockQuantity: number;
};

export type UpdateAdvertisementRequest = {
  title: string;
  description: string;
  categoryId: number;
  vehicleBrandId: number | null;
  vehicleModelId: number | null;
  manufacturingYear: number | null;
  modelYear: number | null;
  compatibilityDescription: string | null;
  condition: AdvertisementCondition;
  price: number;
  stockQuantity: number;
};

export type UpdatePhotoOrderRequest = {
  photoIds: number[];
};
