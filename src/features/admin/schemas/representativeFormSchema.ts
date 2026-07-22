import { z } from "zod";

import { isValidCpf, onlyDigits } from "@/utils/document";
import { isValidPostalCode } from "@/utils/postalCode";
import { BRAZILIAN_STATES } from "@/utils/brazilianStates";

export const representativeFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome"),
  email: z
    .string()
    .trim()
    .min(1, "Informe o e-mail")
    .email("Informe um e-mail válido"),
  phone: z
    .string()
    .trim()
    .min(1, "Informe o telefone")
    .refine(
      (value) => onlyDigits(value).length >= 8,
      "Informe um telefone válido com DDD",
    ),
  document: z
    .string()
    .trim()
    .min(1, "Informe o CPF")
    .refine(isValidCpf, "Informe um CPF válido"),
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
      (value) => BRAZILIAN_STATES.includes(value.toUpperCase() as (typeof BRAZILIAN_STATES)[number]),
      "Informe uma UF válida",
    ),
  status: z.enum(["active", "inactive"]),
});

export type RepresentativeFormValues = z.infer<typeof representativeFormSchema>;

export const representativeFormDefaultValues: RepresentativeFormValues = {
  name: "",
  email: "",
  phone: "",
  document: "",
  zipCode: "",
  addressStreet: "",
  addressNumber: "",
  addressComplement: "",
  neighborhood: "",
  city: "",
  state: "",
  status: "active",
};
