/**
 * Enums expostos pela API (valores numéricos System.Text.Json).
 * Fonte: ClubePecas.Domain.Enums
 *
 * Autenticação do MVP: visitante (sem conta) ou vendedor cadastrado.
 */

export enum UserRole {
  Administrator = 1,
  Seller = 2,
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

/** Status da assinatura do vendedor (Sprint 5.2). */
export enum SellerSubscriptionStatus {
  Active = 1,
  Cancelled = 2,
  Expired = 3,
}

/**
 * Tipo de ícone da categoria (CRUD administrativo — Sprint 4.3.6).
 * Hoje só Lucide é usado na UI; Svg/Url preparados para o futuro.
 */
export enum CategoryIconType {
  Lucide = 1,
  Svg = 2,
  Url = 3,
}
