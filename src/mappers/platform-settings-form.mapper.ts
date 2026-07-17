import type {
  PlatformSettingsResponse,
  UpdatePlatformSettingsRequest,
} from "@/contracts/admin/settings";
import type { PlatformSettingsFormValues } from "@/features/admin/schemas/platformSettingsFormSchema";

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * Mapeia a resposta da API para valores do formulário.
 */
export function mapPlatformSettingsToForm(
  settings: PlatformSettingsResponse,
): PlatformSettingsFormValues {
  return {
    marketplaceName: settings.marketplaceName,
    marketplaceDescription: settings.marketplaceDescription ?? "",
    contactEmail: settings.contactEmail ?? "",
    contactPhone: settings.contactPhone ?? "",
    whatsApp: settings.whatsApp ?? "",
    instagram: settings.instagram ?? "",
    facebook: settings.facebook ?? "",
    youTube: settings.youTube ?? "",
    website: settings.website ?? "",
    marketplaceEnabled: settings.marketplaceEnabled,
    sellerRegistrationEnabled: settings.sellerRegistrationEnabled,
    advertisementCreationEnabled: settings.advertisementCreationEnabled,
    analyticsEnabled: settings.analyticsEnabled,
    shareEnabled: settings.shareEnabled,
    whatsAppEnabled: settings.whatsAppEnabled,
    instagramEnabled: settings.instagramEnabled,
    defaultAdvertisementLimit: settings.defaultAdvertisementLimit,
    defaultImagesPerAdvertisement: settings.defaultImagesPerAdvertisement,
    maxImageSizeMb: settings.maxImageSizeMb,
    onlineTimeoutMinutes: settings.onlineTimeoutMinutes,
    defaultMetaTitle: settings.defaultMetaTitle ?? "",
    defaultMetaDescription: settings.defaultMetaDescription ?? "",
    defaultOgImage: settings.defaultOgImage ?? "",
  };
}

/**
 * Mapeia o formulário para o payload de atualização.
 */
export function mapPlatformSettingsFormToRequest(
  values: PlatformSettingsFormValues,
): UpdatePlatformSettingsRequest {
  return {
    marketplaceName: values.marketplaceName.trim(),
    marketplaceDescription: emptyToNull(values.marketplaceDescription),
    contactEmail: emptyToNull(values.contactEmail),
    contactPhone: emptyToNull(values.contactPhone),
    whatsApp: emptyToNull(values.whatsApp),
    instagram: emptyToNull(values.instagram),
    facebook: emptyToNull(values.facebook),
    youTube: emptyToNull(values.youTube),
    website: emptyToNull(values.website),
    marketplaceEnabled: values.marketplaceEnabled,
    sellerRegistrationEnabled: values.sellerRegistrationEnabled,
    advertisementCreationEnabled: values.advertisementCreationEnabled,
    analyticsEnabled: values.analyticsEnabled,
    shareEnabled: values.shareEnabled,
    whatsAppEnabled: values.whatsAppEnabled,
    instagramEnabled: values.instagramEnabled,
    defaultAdvertisementLimit: values.defaultAdvertisementLimit,
    defaultImagesPerAdvertisement: values.defaultImagesPerAdvertisement,
    maxImageSizeMb: values.maxImageSizeMb,
    onlineTimeoutMinutes: values.onlineTimeoutMinutes,
    defaultMetaTitle: emptyToNull(values.defaultMetaTitle),
    defaultMetaDescription: emptyToNull(values.defaultMetaDescription),
    defaultOgImage: emptyToNull(values.defaultOgImage),
  };
}
