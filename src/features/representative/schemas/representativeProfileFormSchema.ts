import { z } from "zod";

import { onlyDigits } from "@/utils/document";
import { isValidPostalCode } from "@/utils/postalCode";
import { BRAZILIAN_STATES } from "@/utils/brazilianStates";

export const representativeProfileFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome"),
  phone: z
    .string()
    .trim()
    .min(1, "Informe o telefone")
    .refine(
      (value) => onlyDigits(value).length >= 8,
      "Informe um telefone válido com DDD",
    ),
  zipCode: z
    .string()
    .trim()
    .min(1, "Informe o CEP")
    .refine(isValidPostalCode, "Informe um CEP válido com 8 dígitos"),
  addressStreet: z.string().trim().min(1, "Informe o logradouro"),
  addressNumber: z.string().trim().min(1, "Informe o número"),
  addressComplement: z.string(),
  neighborhood: z.string().trim().min(1, "Informe o bairro"),
  city: z.string().trim().min(1, "Informe a cidade"),
  state: z
    .string()
    .trim()
    .min(1, "Informe a UF")
    .refine(
      (value) =>
        BRAZILIAN_STATES.includes(
          value.toUpperCase() as (typeof BRAZILIAN_STATES)[number],
        ),
      "Informe uma UF válida",
    ),
});

export type RepresentativeProfileFormValues = z.infer<
  typeof representativeProfileFormSchema
>;

export const representativeProfileFormDefaultValues: RepresentativeProfileFormValues =
  {
    name: "",
    phone: "",
    zipCode: "",
    addressStreet: "",
    addressNumber: "",
    addressComplement: "",
    neighborhood: "",
    city: "",
    state: "",
  };
