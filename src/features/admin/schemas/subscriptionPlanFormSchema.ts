import { z } from "zod";

import { parsePriceInput } from "@/utils/parsePriceInput";

/**
 * Schema do formulário de plano de assinatura (criar/editar) — área administrativa.
 */
export const subscriptionPlanFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome do plano")
    .max(100, "Máximo de 100 caracteres"),
  description: z
    .string()
    .max(1000, "Máximo de 1000 caracteres"),
  price: z
    .string()
    .trim()
    .min(1, "Informe o preço")
    .refine((value) => !Number.isNaN(parsePriceInput(value)), "Preço inválido")
    .refine(
      (value) => parsePriceInput(value) >= 0,
      "O preço deve ser zero ou maior",
    ),
  advertisementLimit: z
    .number({ error: "Informe um número válido" })
    .int("Informe um número inteiro")
    .min(0, "Deve ser zero ou maior"),
  displayOrder: z
    .number({ error: "Informe um número válido" })
    .int("Informe um número inteiro")
    .min(0, "Deve ser zero ou maior"),
  isActive: z.boolean(),
});

export type SubscriptionPlanFormValues = z.infer<
  typeof subscriptionPlanFormSchema
>;

export const subscriptionPlanFormDefaultValues: SubscriptionPlanFormValues = {
  name: "",
  description: "",
  price: "",
  advertisementLimit: 0,
  displayOrder: 0,
  isActive: true,
};
