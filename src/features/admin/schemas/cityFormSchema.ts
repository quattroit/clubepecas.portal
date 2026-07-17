import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Schema do formulário de cidade (criar/editar) — área administrativa.
 */
export const cityFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome da cidade")
    .max(100, "Máximo de 100 caracteres"),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .length(2, "Informe a UF com 2 letras")
    .regex(/^[A-Z]{2}$/, "Informe uma UF válida"),
  slug: z
    .string()
    .trim()
    .max(120, "Máximo de 120 caracteres")
    .refine(
      (value) => value === "" || slugPattern.test(value),
      "Use apenas letras minúsculas, números e hífens",
    ),
  displayOrder: z
    .number({ error: "Informe um número válido" })
    .int("Informe um número inteiro")
    .min(0, "Deve ser zero ou maior"),
  isActive: z.boolean(),
});

export type CityFormValues = z.infer<typeof cityFormSchema>;

export const cityFormDefaultValues: CityFormValues = {
  name: "",
  state: "",
  slug: "",
  displayOrder: 0,
  isActive: true,
};
