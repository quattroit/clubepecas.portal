import type { AdvertisementCondition } from "@/contracts/common/enums";

export type CreateAdvertisementRequest = {
  title: string;
  description: string;
  categoryId: string;
  vehicleBrandId: string;
  vehicleModelId: string;
  manufacturingYear: number;
  modelYear: number;
  compatibilityDescription: string;
  condition: AdvertisementCondition;
  price: number;
  stockQuantity: number;
};

export type UpdateAdvertisementRequest = {
  title: string;
  description: string;
  categoryId: string;
  vehicleBrandId: string;
  vehicleModelId: string;
  manufacturingYear: number;
  modelYear: number;
  compatibilityDescription: string;
  condition: AdvertisementCondition;
  price: number;
  stockQuantity: number;
};

export type CreatePhotoRequest = {
  url: string;
};

export type UpdatePhotoOrderItemRequest = {
  id: string;
  displayOrder: number;
};

export type UpdatePhotoOrderRequest = {
  items: UpdatePhotoOrderItemRequest[];
};
