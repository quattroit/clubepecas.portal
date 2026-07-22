import type {
  PlatformSettingsResponse,
  UpdatePlatformSettingsRequest,
} from "@/contracts/admin/settings";
import type { PlatformSettingsFormValues } from "@/features/admin/schemas/platformSettingsFormSchema";
import { formatDocumentInput } from "@/utils/document";
import { PersonType } from "@/contracts/common/enums";

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
    platformName: settings.platformName,
    platformDescription: settings.platformDescription ?? "",
    supportEmail: settings.supportEmail ?? "",
    supportPhone: settings.supportPhone ?? "",
    whatsApp: settings.whatsApp ?? "",
    companyName: settings.companyName ?? "",
    companyDocument: settings.companyDocument
      ? formatDocumentInput(settings.companyDocument, PersonType.Company)
      : "",
    street: settings.street ?? "",
    number: settings.number ?? "",
    complement: settings.complement ?? "",
    neighborhood: settings.neighborhood ?? "",
    city: settings.city ?? "",
    state: settings.state ?? "",
    zipCode: settings.zipCode ?? "",
    country: settings.country ?? "",
    instagram: settings.instagram ?? "",
    facebook: settings.facebook ?? "",
    youTube: settings.youTube ?? "",
    tikTok: settings.tikTok ?? "",
    linkedIn: settings.linkedIn ?? "",
    x: settings.x ?? "",
    website: settings.website ?? "",
    logoUrl: settings.logoUrl ?? "",
    logoDarkUrl: settings.logoDarkUrl ?? "",
    faviconUrl: settings.faviconUrl ?? "",
    footerCopyright: settings.footerCopyright ?? "",
    defaultTitle: settings.defaultTitle ?? "",
    defaultDescription: settings.defaultDescription ?? "",
    defaultKeywords: settings.defaultKeywords ?? "",
    defaultOgImage: settings.defaultOgImage ?? "",
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
    representativeProgramEnabled: settings.representativeProgramEnabled,
    representativeFirstSaleCommissionPercentage:
      settings.representativeFirstSaleCommissionPercentage,
    representativeRecurringCommissionPercentage:
      settings.representativeRecurringCommissionPercentage,
    representativeCommissionCurrency:
      settings.representativeCommissionCurrency as "BRL",
    representativeMinimumPayoutAmount:
      settings.representativeMinimumPayoutAmount,
    representativeDefaultPayoutDay: settings.representativeDefaultPayoutDay,
    representativeCommissionNotes: settings.representativeCommissionNotes ?? "",
  };
}

/**
 * Mapeia o formulário para o payload de atualização.
 */
export function mapPlatformSettingsFormToRequest(
  values: PlatformSettingsFormValues,
): UpdatePlatformSettingsRequest {
  return {
    platformName: values.platformName.trim(),
    platformDescription: emptyToNull(values.platformDescription),
    supportEmail: emptyToNull(values.supportEmail),
    supportPhone: emptyToNull(values.supportPhone),
    whatsApp: emptyToNull(values.whatsApp),
    companyName: emptyToNull(values.companyName),
    companyDocument: emptyToNull(values.companyDocument),
    street: emptyToNull(values.street),
    number: emptyToNull(values.number),
    complement: emptyToNull(values.complement),
    neighborhood: emptyToNull(values.neighborhood),
    city: emptyToNull(values.city),
    state: emptyToNull(values.state),
    zipCode: emptyToNull(values.zipCode),
    country: emptyToNull(values.country),
    instagram: emptyToNull(values.instagram),
    facebook: emptyToNull(values.facebook),
    youTube: emptyToNull(values.youTube),
    tikTok: emptyToNull(values.tikTok),
    linkedIn: emptyToNull(values.linkedIn),
    x: emptyToNull(values.x),
    website: emptyToNull(values.website),
    logoUrl: emptyToNull(values.logoUrl),
    logoDarkUrl: emptyToNull(values.logoDarkUrl),
    faviconUrl: emptyToNull(values.faviconUrl),
    footerCopyright: emptyToNull(values.footerCopyright),
    defaultTitle: emptyToNull(values.defaultTitle),
    defaultDescription: emptyToNull(values.defaultDescription),
    defaultKeywords: emptyToNull(values.defaultKeywords),
    defaultOgImage: emptyToNull(values.defaultOgImage),
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
    representativeProgramEnabled: values.representativeProgramEnabled,
    representativeFirstSaleCommissionPercentage:
      values.representativeFirstSaleCommissionPercentage,
    representativeRecurringCommissionPercentage:
      values.representativeRecurringCommissionPercentage,
    representativeCommissionCurrency: values.representativeCommissionCurrency,
    representativeMinimumPayoutAmount: values.representativeMinimumPayoutAmount,
    representativeDefaultPayoutDay: values.representativeDefaultPayoutDay,
    representativeCommissionNotes: emptyToNull(
      values.representativeCommissionNotes,
    ),
  };
}
