import { z } from "zod";

import { PASSWORD_DIGIT_REGEX, PASSWORD_LETTER_REGEX, PASSWORD_MIN_LENGTH } from "@/lib/auth/passwordPolicy";
import { isValidDocumentAuto, onlyDigits } from "@/utils/document";
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
    .min(1, "Informe o CPF ou CNPJ")
    .refine(isValidDocumentAuto, "Informe um CPF ou CNPJ válido"),
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
  /** Somente na criação — opcional. Habilita login imediato no portal. */
  password: z
    .string()
    .refine((value) => value.length === 0 || value.length >= PASSWORD_MIN_LENGTH, {
      message: "A senha deve possuir pelo menos 8 caracteres",
    })
    .refine((value) => value.length === 0 || PASSWORD_LETTER_REGEX.test(value), {
      message: "A senha deve conter pelo menos uma letra",
    })
    .refine((value) => value.length === 0 || PASSWORD_DIGIT_REGEX.test(value), {
      message: "A senha deve conter pelo menos um número",
    }),
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
  password: "",
};
