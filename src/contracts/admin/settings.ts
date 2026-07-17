/**
 * Contratos das configurações globais da plataforma (admin).
 */

export type PlatformSettingsResponse = {
  marketplaceName: string;
  marketplaceDescription: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  whatsApp: string | null;
  instagram: string | null;
  facebook: string | null;
  youTube: string | null;
  website: string | null;
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
  defaultMetaTitle: string | null;
  defaultMetaDescription: string | null;
  defaultOgImage: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type UpdatePlatformSettingsRequest = {
  marketplaceName: string;
  marketplaceDescription: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  whatsApp: string | null;
  instagram: string | null;
  facebook: string | null;
  youTube: string | null;
  website: string | null;
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
  defaultMetaTitle: string | null;
  defaultMetaDescription: string | null;
  defaultOgImage: string | null;
};
