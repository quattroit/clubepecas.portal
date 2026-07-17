import { z } from "zod";

import { CategoryIconType } from "@/contracts/common/enums";

const optionalText = z.string();

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || z.url().safeParse(value).success,
    "Informe uma URL válida (https://…)",
  );

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Schema do formulário de categoria (criar/editar) — área administrativa.
 * `iconType` fixo em Lucide (única opção disponível na UI atual).
 */
export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome da categoria")
    .max(100, "Máximo de 100 caracteres"),
  slug: z
    .string()
    .trim()
    .min(1, "Informe o slug")
    .max(120, "Máximo de 120 caracteres")
    .refine(
      (value) => slugPattern.test(value),
      "Use apenas letras minúsculas, números e hífens",
    ),
  description: optionalText.max(500, "Máximo de 500 caracteres"),
  iconValue: z
    .string()
    .trim()
    .min(1, "Informe o ícone da categoria")
    .max(60, "Máximo de 60 caracteres"),
  displayOrder: z
    .number({ error: "Informe um número válido" })
    .int("Informe um número inteiro")
    .min(0, "Deve ser zero ou maior"),
  isActive: z.boolean(),
  metaTitle: optionalText.max(200, "Máximo de 200 caracteres"),
  metaDescription: optionalText.max(500, "Máximo de 500 caracteres"),
  ogImage: optionalUrl.max(500, "Máximo de 500 caracteres"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const categoryFormDefaultValues: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  iconValue: "Boxes",
  displayOrder: 0,
  isActive: true,
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
};

export const CATEGORY_ICON_TYPE = CategoryIconType.Lucide;
