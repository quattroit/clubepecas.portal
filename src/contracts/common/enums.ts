/**
 * Enums expostos pela API (valores numéricos System.Text.Json).
 * Fonte: ClubePecas.Domain.Enums
 *
 * Autenticação do MVP: visitante (sem conta) ou vendedor cadastrado.
 */

export enum UserRole {
  Administrator = 1,
  Seller = 2,
  /** Representante comercial — portal próprio (Sprint 10.6). */
  Representative = 3,
  /** Comprador profissional — área /comprador (Sprint 9.1). */
  ProfessionalBuyer = 4,
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
  /** Aguardando conclusão do checkout (Sprint 8.2). */
  Pending = 4,
  /** Renovação cancelada — benefícios até o fim do período (Sprint 8.5). */
  CancellationRequested = 5,
}

/** Tipo da movimentação financeira (Épico 8). */
export enum PaymentType {
  Subscription = 1,
  Renewal = 2,
  Refund = 3,
  Credit = 4,
  Discount = 5,
  Adjustment = 6,
}

/** Status do pagamento (Épico 8). */
export enum PaymentStatus {
  Pending = 1,
  Processing = 2,
  Paid = 3,
  Cancelled = 4,
  Failed = 5,
  Expired = 6,
  Refunded = 7,
}

/** Provedor de pagamento (Épico 8). */
export enum PaymentProvider {
  None = 0,
  Asaas = 1,
  Stripe = 2,
  MercadoPago = 3,
}

/** Meio de pagamento (Épico 8). */
export enum PaymentMethod {
  Unknown = 0,
  Pix = 1,
  CreditCard = 2,
  Boleto = 3,
  BankTransfer = 4,
}

/** Tipo de pessoa do vendedor (Sprint 5.6). */
export enum PersonType {
  Individual = 1,
  Company = 2,
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

/** Ciclo de cobrança dos planos de assinatura (Sprint 8.3.1 — múltiplos ciclos). */
export enum BillingCycle {
  Monthly = 1,
  Quarterly = 2,
  Yearly = 3,
}

/** Status do pagamento de comissões a representantes (Sprint 10.7). */
export enum PayoutStatus {
  Pending = 1,
  Paid = 2,
  Cancelled = 3,
}

/**
 * Meio de pagamento usado para liquidar comissões de representantes (Sprint 10.7).
 * Não confundir com `PaymentMethod` (pagamentos de vendedores).
 */
export enum PayoutPaymentMethod {
  Manual = 1,
  Pix = 2,
  BankTransfer = 3,
}

/** Segmento de atuação do comprador profissional (Sprint 9.1). */
export enum ProfessionalBuyerSegment {
  MechanicalWorkshop = 1,
  BodyShop = 2,
  AutoElectric = 3,
  AutomotiveCenter = 4,
  Dealership = 5,
  Fleet = 6,
  RentalCompany = 7,
  Other = 8,
}

/** Status do perfil de comprador profissional (Sprint 9.1). */
export enum ProfessionalBuyerStatus {
  Pending = 1,
  Active = 2,
  Suspended = 3,
}
