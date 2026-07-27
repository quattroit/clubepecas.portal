import { z } from "zod";

import { ProfessionalBuyerSegment } from "@/contracts/common/enums";
import { passwordSchema } from "@/lib/auth/passwordPolicy";
import { isValidDocumentAuto, onlyDigits } from "@/utils/document";
import { isValidPostalCode } from "@/utils/postalCode";

export const professionalBuyerFormSchema = z.object({
  companyName: z.string().trim().min(1, "Informe o nome fantasia"),
  corporateName: z.string().trim().min(1, "Informe a razão social"),
  document: z
    .string()
    .trim()
    .min(1, "Informe o CPF ou CNPJ")
    .refine(isValidDocumentAuto, "Informe um CPF ou CNPJ válido"),
  contactName: z.string().trim().min(1, "Informe o nome do contato"),
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
  whatsApp: z
    .string()
    .trim()
    .min(1, "Informe o WhatsApp")
    .refine(
      (value) => onlyDigits(value).length >= 8,
      "Informe um WhatsApp válido com DDD",
    ),
  cityId: z
    .number()
    .int()
    .positive("Selecione a cidade"),
  address: z.string().trim().min(1, "Informe o endereço"),
  number: z.string().trim().min(1, "Informe o número"),
  neighborhood: z.string().trim().min(1, "Informe o bairro"),
  zipCode: z
    .string()
    .trim()
    .min(1, "Informe o CEP")
    .refine(isValidPostalCode, "Informe um CEP válido com 8 dígitos"),
  segment: z.nativeEnum(ProfessionalBuyerSegment, {
    message: "Selecione o segmento",
  }),
  temporaryPassword: passwordSchema,
});

export type ProfessionalBuyerFormValues = z.infer<
  typeof professionalBuyerFormSchema
>;

export const professionalBuyerFormDefaultValues: ProfessionalBuyerFormValues =
  {
    companyName: "",
    corporateName: "",
    document: "",
    contactName: "",
    email: "",
    phone: "",
    whatsApp: "",
    cityId: 0,
    address: "",
    number: "",
    neighborhood: "",
    zipCode: "",
    segment: ProfessionalBuyerSegment.MechanicalWorkshop,
    temporaryPassword: "",
  };
