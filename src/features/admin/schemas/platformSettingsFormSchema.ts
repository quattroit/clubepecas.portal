import { z } from "zod";

const optionalText = z.string();

const optionalEmail = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || z.email().safeParse(value).success,
    "Informe um e-mail válido",
  );

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || z.url().safeParse(value).success,
    "Informe uma URL válida (https://…)",
  );

/**
 * Schema do formulário de configurações da plataforma.
 */
export const platformSettingsFormSchema = z.object({
  marketplaceName: z
    .string()
    .trim()
    .min(1, "Informe o nome da plataforma")
    .max(150, "Máximo de 150 caracteres"),
  marketplaceDescription: optionalText.max(
    2000,
    "Máximo de 2000 caracteres",
  ),
  contactEmail: optionalEmail,
  contactPhone: optionalText.max(30, "Máximo de 30 caracteres"),
  whatsApp: optionalText.max(30, "Máximo de 30 caracteres"),
  instagram: optionalText.max(200, "Máximo de 200 caracteres"),
  facebook: optionalUrl.max(500, "Máximo de 500 caracteres"),
  youTube: optionalUrl.max(500, "Máximo de 500 caracteres"),
  website: optionalUrl.max(500, "Máximo de 500 caracteres"),
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
  defaultMetaTitle: optionalText.max(200, "Máximo de 200 caracteres"),
  defaultMetaDescription: optionalText.max(500, "Máximo de 500 caracteres"),
  defaultOgImage: optionalUrl.max(500, "Máximo de 500 caracteres"),
});

export type PlatformSettingsFormValues = z.infer<
  typeof platformSettingsFormSchema
>;

export const platformSettingsFormDefaultValues: PlatformSettingsFormValues = {
  marketplaceName: "",
  marketplaceDescription: "",
  contactEmail: "",
  contactPhone: "",
  whatsApp: "",
  instagram: "",
  facebook: "",
  youTube: "",
  website: "",
  marketplaceEnabled: true,
  sellerRegistrationEnabled: true,
  advertisementCreationEnabled: true,
  analyticsEnabled: true,
  shareEnabled: true,
  whatsAppEnabled: true,
  instagramEnabled: true,
  defaultAdvertisementLimit: 20,
  defaultImagesPerAdvertisement: 10,
  maxImageSizeMb: 5,
  onlineTimeoutMinutes: 15,
  defaultMetaTitle: "",
  defaultMetaDescription: "",
  defaultOgImage: "",
};
