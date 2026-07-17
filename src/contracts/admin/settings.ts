/**
 * Contratos das configurações globais da plataforma (admin).
 *
 * Os flags e limites são mantidos no contrato para que continuem sendo
 * enviados ao salvar, mesmo sem controles visíveis na interface.
 */
export type PlatformSettingsResponse = {
  platformName: string;
  platformDescription: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
  whatsApp: string | null;
  companyName: string | null;
  companyDocument: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  instagram: string | null;
  facebook: string | null;
  youTube: string | null;
  tikTok: string | null;
  linkedIn: string | null;
  x: string | null;
  website: string | null;
  logoUrl: string | null;
  logoDarkUrl: string | null;
  faviconUrl: string | null;
  footerCopyright: string | null;
  defaultTitle: string | null;
  defaultDescription: string | null;
  defaultKeywords: string | null;
  defaultOgImage: string | null;
  marketplaceEnabled: boolean;
  sellerRegistrationEnabled: boolean;
  advertisementCreationEnabled: boolean;
  analyticsEnabled: boolean;
  shareEnabled: boolean;
  whatsAppEnabled: boolean;
  instagramEnabled: boolean;
  defaultAdvertisementLimit: number;
  defaultImagesPerAdvertisement: number;
  maxImageSizeMb: number;
  onlineTimeoutMinutes: number;
  createdAt: string;
  updatedAt: string | null;
};

export type UpdatePlatformSettingsRequest = {
  platformName: string;
  platformDescription: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
  whatsApp: string | null;
  companyName: string | null;
  companyDocument: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  instagram: string | null;
  facebook: string | null;
  youTube: string | null;
  tikTok: string | null;
  linkedIn: string | null;
  x: string | null;
  website: string | null;
  logoUrl: string | null;
  logoDarkUrl: string | null;
  faviconUrl: string | null;
  footerCopyright: string | null;
  defaultTitle: string | null;
  defaultDescription: string | null;
  defaultKeywords: string | null;
  defaultOgImage: string | null;
  marketplaceEnabled: boolean;
  sellerRegistrationEnabled: boolean;
  advertisementCreationEnabled: boolean;
  analyticsEnabled: boolean;
  shareEnabled: boolean;
  whatsAppEnabled: boolean;
  instagramEnabled: boolean;
  defaultAdvertisementLimit: number;
  defaultImagesPerAdvertisement: number;
  maxImageSizeMb: number;
  onlineTimeoutMinutes: number;
};
