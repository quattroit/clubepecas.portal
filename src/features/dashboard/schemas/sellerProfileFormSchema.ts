import { z } from "zod";

import { PersonType } from "@/contracts/common/enums";
import { isValidDocument } from "@/utils/document";
import { isValidPostalCode } from "@/utils/postalCode";

const optionalText = z.string();

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" ||
      z.url().safeParse(value).success ||
      value.startsWith("/uploads/"),
    "Informe uma URL válida",
  );

/**
 * Schema compartilhado create/edit do perfil de vendedor.
 * Campos alinhados a CreateSellerRequest / UpdateSellerRequest.
 */
export const sellerProfileFormSchema = z
  .object({
    storeName: z.string().trim().min(1, "Informe o nome da loja"),
    cityId: z
      .union([z.string(), z.number()])
      .transform((value) => Number(value))
      .pipe(
        z.number().int("Selecione a cidade").positive("Selecione a cidade"),
      ),
    personType: z.nativeEnum(PersonType, {
      error: "Selecione o tipo de pessoa",
    }),
    document: z.string().trim().min(1, "Informe o CPF ou CNPJ"),
    zipCode: z
      .string()
      .trim()
      .min(1, "Informe o CEP")
      .refine(isValidPostalCode, "Informe um CEP válido com 8 dígitos"),
    street: z.string().trim().min(1, "Informe o logradouro"),
    number: z.string().trim().min(1, "Informe o número"),
    complement: optionalText,
    neighborhood: z.string().trim().min(1, "Informe o bairro"),
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
  })
  .superRefine((values, ctx) => {
    if (!isValidDocument(values.document, values.personType)) {
      ctx.addIssue({
        code: "custom",
        path: ["document"],
        message:
          values.personType === PersonType.Individual
            ? "Informe um CPF válido"
            : "Informe um CNPJ válido",
      });
    }
  });

export type SellerProfileFormValues = z.infer<typeof sellerProfileFormSchema>;

export const sellerProfileFormDefaultValues: SellerProfileFormValues = {
  storeName: "",
  cityId: 0,
  personType: PersonType.Individual,
  document: "",
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  description: "",
  whatsApp: "",
  instagram: "",
  photoUrl: "",
};
