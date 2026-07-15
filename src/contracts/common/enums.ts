/**
 * Enums expostos pela API (valores numéricos System.Text.Json).
 * Fonte: ClubePecas.Domain.Enums
 */

export enum UserRole {
  Administrator = 1,
  Seller = 2,
  Buyer = 3,
}

export enum AdvertisementCategory {
  Engine = 1,
  Transmission = 2,
  Suspension = 3,
  Body = 4,
  Electrical = 5,
  Interior = 6,
  WheelsAndTires = 7,
  Accessory = 8,
  Other = 9,
}

export enum AdvertisementCondition {
  New = 1,
  Used = 2,
  Refurbished = 3,
}

export enum AdvertisementStatus {
  Published = 1,
  Paused = 2,
  Sold = 3,
  Archived = 4,
}
