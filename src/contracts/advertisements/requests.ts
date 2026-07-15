import type {
  AdvertisementCategory,
  AdvertisementCondition,
} from "@/contracts/common/enums";

export type CreateAdvertisementRequest = {
  title: string;
  description: string;
  category: AdvertisementCategory;
  compatibilityDescription: string;
  condition: AdvertisementCondition;
  price: number;
};

export type UpdateAdvertisementRequest = {
  title: string;
  description: string;
  category: AdvertisementCategory;
  compatibilityDescription: string;
  condition: AdvertisementCondition;
  price: number;
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
