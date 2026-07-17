import { z } from "zod";

const optionalText = z.string();

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || z.url().safeParse(value).success,
    "Informe uma URL válida (https://…)",
  );

/**
 * Schema compartilhado create/edit do perfil de vendedor.
 * Campos alinhados a CreateSellerRequest / UpdateSellerRequest.
 */
export const sellerProfileFormSchema = z.object({
  storeName: z.string().trim().min(1, "Informe o nome da loja"),
  displayName: z.string().trim().min(1, "Informe o nome de exibição"),
  cityId: z.string().trim().min(1, "Selecione a cidade"),
  description: optionalText,
  whatsApp: z
    .string()
    .trim()
    .min(1, "Informe o WhatsApp")
    .refine(
      (value) => value.replace(/\D/g, "").length >= 8,
      "Informe um WhatsApp válido com DDD",
    ),
  instagram: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        /^@?[A-Za-z0-9._]{1,30}$/.test(value) ||
        /instagram\.com\/[^/?#]+/i.test(value),
      "Informe um @usuário ou URL do Instagram válida",
    ),
  photoUrl: optionalUrl,
});

export type SellerProfileFormValues = z.infer<typeof sellerProfileFormSchema>;

export const sellerProfileFormDefaultValues: SellerProfileFormValues = {
  storeName: "",
  displayName: "",
  cityId: "",
  description: "",
  whatsApp: "",
  instagram: "",
  photoUrl: "",
};
