import { z } from "zod";

import { BillingCycle } from "@/contracts/common/enums";
import { parsePriceInput } from "@/utils/parsePriceInput";

/**
 * Linha de preço (um ciclo de cobrança) do formulário de plano — Sprint 8.3.1.
 * `id` presente = preço existente (atualiza); ausente = novo ciclo (cria).
 */
export const subscriptionPlanPriceFormSchema = z.object({
  id: z.number().optional(),
  billingCycle: z.nativeEnum(BillingCycle, {
    error: "Selecione o ciclo de cobrança",
  }),
  price: z
    .string()
    .trim()
    .min(1, "Informe o preço")
    .refine((value) => !Number.isNaN(parsePriceInput(value)), "Preço inválido")
    .refine(
      (value) => parsePriceInput(value) >= 0,
      "O preço deve ser zero ou maior",
    ),
  displayName: z.string().max(100, "Máximo de 100 caracteres"),
  description: z.string().max(500, "Máximo de 500 caracteres"),
  displayOrder: z
    .number({ error: "Informe um número válido" })
    .int("Informe um número inteiro")
    .min(0, "Deve ser zero ou maior"),
  isActive: z.boolean(),
  isRecommended: z.boolean().default(false),
});

export type SubscriptionPlanPriceFormValues = z.infer<
  typeof subscriptionPlanPriceFormSchema
>;

export const subscriptionPlanPriceFormDefaultValues: SubscriptionPlanPriceFormValues =
  {
    billingCycle: BillingCycle.Monthly,
    price: "",
    displayName: "",
    description: "",
    displayOrder: 0,
    isActive: true,
    isRecommended: false,
  };

/**
 * Schema do formulário de plano de assinatura (criar/editar) — área administrativa.
 * Um plano deve ter ao menos um ciclo de cobrança e cada ciclo só pode aparecer uma vez.
 */
export const subscriptionPlanFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome do plano")
    .max(100, "Máximo de 100 caracteres"),
  description: z.string().max(1000, "Máximo de 1000 caracteres"),
  advertisementLimit: z
    .number({ error: "Informe um número válido" })
    .int("Informe um número inteiro")
    .min(0, "Deve ser zero ou maior"),
  displayOrder: z
    .number({ error: "Informe um número válido" })
    .int("Informe um número inteiro")
    .min(0, "Deve ser zero ou maior"),
  isActive: z.boolean(),
  prices: z
    .array(subscriptionPlanPriceFormSchema)
    .min(1, "Adicione ao menos um ciclo de cobrança")
    .refine((prices) => {
      const cycles = prices.map((price) => price.billingCycle);
      return new Set(cycles).size === cycles.length;
    }, "Cada ciclo de cobrança pode ser adicionado apenas uma vez"),
});

export type SubscriptionPlanFormValues = z.infer<
  typeof subscriptionPlanFormSchema
>;

export const subscriptionPlanFormDefaultValues: SubscriptionPlanFormValues = {
  name: "",
  description: "",
  advertisementLimit: 0,
  displayOrder: 0,
  isActive: true,
  prices: [subscriptionPlanPriceFormDefaultValues],
};
