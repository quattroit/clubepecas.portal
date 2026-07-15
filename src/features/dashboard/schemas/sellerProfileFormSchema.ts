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
  city: z.string().trim().min(1, "Informe a cidade"),
  state: z.string().trim().min(1, "Informe o estado"),
  description: optionalText,
  whatsApp: optionalText,
  photoUrl: optionalUrl,
});

export type SellerProfileFormValues = z.infer<typeof sellerProfileFormSchema>;

export const sellerProfileFormDefaultValues: SellerProfileFormValues = {
  storeName: "",
  displayName: "",
  city: "",
  state: "",
  description: "",
  whatsApp: "",
  photoUrl: "",
};
