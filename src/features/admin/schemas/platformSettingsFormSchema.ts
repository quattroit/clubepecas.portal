import { z } from "zod";

import { isValidCnpj } from "@/utils/document";

const optionalText = z.string();

const optionalEmail = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || z.email().safeParse(value).success,
    "Informe um e-mail válido",
  );

const optionalSocial = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" ||
      value.startsWith("/") ||
      value.startsWith("@") ||
      z.url().safeParse(value).success ||
      !/\s/.test(value),
    "Informe uma URL ou handle válido",
  );

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" ||
      value.startsWith("/") ||
      z.url().safeParse(value).success,
    "Informe uma URL válida ou um caminho iniciado por /",
  );

/**
 * Schema do formulário de configurações da plataforma.
 */
export const platformSettingsFormSchema = z.object({
  platformName: z
    .string()
    .trim()
    .min(1, "Informe o nome da plataforma")
    .max(150, "Máximo de 150 caracteres"),
  platformDescription: optionalText.max(
    2000,
    "Máximo de 2000 caracteres",
  ),
  supportEmail: optionalEmail,
  supportPhone: optionalText.max(30, "Máximo de 30 caracteres"),
  whatsApp: optionalText.max(30, "Máximo de 30 caracteres"),
  companyName: optionalText.max(200, "Máximo de 200 caracteres"),
  companyDocument: optionalText.refine(
    (value) => value.trim() === "" || isValidCnpj(value),
    "Informe um CNPJ válido",
  ),
  street: optionalText.max(200, "Máximo de 200 caracteres"),
  number: optionalText.max(30, "Máximo de 30 caracteres"),
  complement: optionalText.max(100, "Máximo de 100 caracteres"),
  neighborhood: optionalText.max(100, "Máximo de 100 caracteres"),
  city: optionalText.max(100, "Máximo de 100 caracteres"),
  state: optionalText
    .trim()
    .refine(
      (value) => value === "" || value.length === 2,
      "Informe a UF com 2 caracteres",
    ),
  zipCode: optionalText.max(20, "Máximo de 20 caracteres"),
  country: optionalText.max(100, "Máximo de 100 caracteres"),
  instagram: optionalSocial.max(500, "Máximo de 500 caracteres"),
  facebook: optionalUrl.max(500, "Máximo de 500 caracteres"),
  youTube: optionalUrl.max(500, "Máximo de 500 caracteres"),
  tikTok: optionalUrl.max(500, "Máximo de 500 caracteres"),
  linkedIn: optionalUrl.max(500, "Máximo de 500 caracteres"),
  x: optionalSocial.max(500, "Máximo de 500 caracteres"),
  website: optionalUrl.max(500, "Máximo de 500 caracteres"),
  logoUrl: optionalUrl.max(500, "Máximo de 500 caracteres"),
  logoDarkUrl: optionalUrl.max(500, "Máximo de 500 caracteres"),
  faviconUrl: optionalUrl.max(500, "Máximo de 500 caracteres"),
  footerCopyright: optionalText.max(500, "Máximo de 500 caracteres"),
  defaultTitle: optionalText.max(200, "Máximo de 200 caracteres"),
  defaultDescription: optionalText.max(500, "Máximo de 500 caracteres"),
  defaultKeywords: optionalText.max(500, "Máximo de 500 caracteres"),
  defaultOgImage: optionalUrl.max(500, "Máximo de 500 caracteres"),
  marketplaceEnabled: z.boolean(),
  sellerRegistrationEnabled: z.boolean(),
  advertisementCreationEnabled: z.boolean(),
  analyticsEnabled: z.boolean(),
  shareEnabled: z.boolean(),
  whatsAppEnabled: z.boolean(),
  instagramEnabled: z.boolean(),
  defaultAdvertisementLimit: z
    .number({ error: "Informe um número válido" })
    .int("Informe um número inteiro")
    .min(1, "Deve ser pelo menos 1"),
  defaultImagesPerAdvertisement: z
    .number({ error: "Informe um número válido" })
    .int("Informe um número inteiro")
    .min(1, "Deve ser pelo menos 1"),
  maxImageSizeMb: z
    .number({ error: "Informe um número válido" })
    .int("Informe um número inteiro")
    .min(1, "Deve ser pelo menos 1"),
  onlineTimeoutMinutes: z
    .number({ error: "Informe um número válido" })
    .int("Informe um número inteiro")
    .min(1, "Deve ser pelo menos 1"),
  representativeProgramEnabled: z.boolean(),
  representativeFirstSaleCommissionPercentage: z
    .number({ error: "Informe um número válido" })
    .min(0, "Deve ser pelo menos 0")
    .max(100, "Deve ser no máximo 100"),
  representativeRecurringCommissionPercentage: z
    .number({ error: "Informe um número válido" })
    .min(0, "Deve ser pelo menos 0")
    .max(100, "Deve ser no máximo 100"),
  representativeCommissionCurrency: z.literal("BRL", {
    error: "Apenas BRL é suportado no momento",
  }),
  representativeMinimumPayoutAmount: z
    .number({ error: "Informe um número válido" })
    .min(0, "Deve ser pelo menos 0"),
  representativeDefaultPayoutDay: z
    .number({ error: "Informe um número válido" })
    .int("Informe um número inteiro")
    .min(1, "Deve ser pelo menos 1")
    .max(28, "Deve ser no máximo 28"),
  representativeCommissionNotes: optionalText.max(
    2000,
    "Máximo de 2000 caracteres",
  ),
});

export type PlatformSettingsFormValues = z.infer<
  typeof platformSettingsFormSchema
>;

export const platformSettingsFormDefaultValues: PlatformSettingsFormValues = {
  platformName: "",
  platformDescription: "",
  supportEmail: "",
  supportPhone: "",
  whatsApp: "",
  companyName: "",
  companyDocument: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  instagram: "",
  facebook: "",
  youTube: "",
  tikTok: "",
  linkedIn: "",
  x: "",
  website: "",
  logoUrl: "",
  logoDarkUrl: "",
  faviconUrl: "",
  footerCopyright: "",
  defaultTitle: "",
  defaultDescription: "",
  defaultKeywords: "",
  defaultOgImage: "",
  marketplaceEnabled: true,
  sellerRegistrationEnabled: true,
  advertisementCreationEnabled: true,
  analyticsEnabled: true,
  shareEnabled: true,
  whatsAppEnabled: true,
  instagramEnabled: true,
  defaultAdvertisementLimit: 20,
  defaultImagesPerAdvertisement: 3,
  maxImageSizeMb: 5,
  onlineTimeoutMinutes: 15,
  representativeProgramEnabled: true,
  representativeFirstSaleCommissionPercentage: 20,
  representativeRecurringCommissionPercentage: 10,
  representativeCommissionCurrency: "BRL",
  representativeMinimumPayoutAmount: 100,
  representativeDefaultPayoutDay: 10,
  representativeCommissionNotes: "",
};
