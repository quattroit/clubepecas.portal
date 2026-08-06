import type { LocalDeliveryPricingMode } from "@/contracts/common/enums";

export type LocalDeliveryTierDto = {
  maxDistanceKm: number;
  price: number;
};

/** GET /api/v1/seller/local-delivery */
export type SellerLocalDeliveryDto = {
  isEnabled: boolean;
  maxRadiusKm: number;
  pricingMode: LocalDeliveryPricingMode;
  fixedFee: number | null;
  pricePerKm: number | null;
  tiers: LocalDeliveryTierDto[];
  hasCompleteAddress: boolean;
};

/** PUT /api/v1/seller/local-delivery */
export type UpdateSellerLocalDeliveryRequest = {
  isEnabled: boolean;
  maxRadiusKm: number;
  pricingMode: LocalDeliveryPricingMode;
  fixedFee?: number | null;
  pricePerKm?: number | null;
  tiers?: LocalDeliveryTierDto[];
};

/** POST /api/v1/local-delivery/estimate */
export type EstimateLocalDeliveryRequest = {
  sellerId?: number | null;
  sellerSlug?: string | null;
  deliveryZipCode: string;
};

export type EstimateLocalDeliveryResponse = {
  isEnabled: boolean;
  withinRadius: boolean;
  maxRadiusKm: number | null;
  distanceKm: number | null;
  estimatedPrice: number | null;
  message: string | null;
  disclaimer: string | null;
};

export const LOCAL_DELIVERY_RADIUS_OPTIONS_KM = [10, 20, 30, 50, 80, 100] as const;
