import { z } from "zod";

import {
  CategoryIconType,
  VehicleRequirement,
} from "@/contracts/common/enums";

const optionalText = z.string();

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || z.url().safeParse(value).success,
    "Informe uma URL válida (https://…)",
  );

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const vehicleRequirementOptions = Object.values(VehicleRequirement)
  .filter((value): value is VehicleRequirement => typeof value === "number")
  .map(String) as [string, ...string[]];

/** Dropdown de pai: "" → null (categoria raiz). */
const optionalParentIdField = z
  .union([z.string(), z.number(), z.null()])
  .transform((value) => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) return null;
    return parsed;
  });

/**
 * Schema do formulário de categoria (criar/editar) — área administrativa.
 * Configuração de campos (veículo/compatibilidade) só se aplica a categorias raiz.
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
  parentId: optionalParentIdField,
  vehicleRequirement: z.enum(vehicleRequirementOptions, {
    message: "Selecione a exigência de veículo",
  }),
  showCompatibility: z.boolean(),
  allowProfessionalRequest: z.boolean(),
  searchKeywords: optionalText.max(500, "Máximo de 500 caracteres"),
  metaTitle: optionalText.max(200, "Máximo de 200 caracteres"),
  metaDescription: optionalText.max(500, "Máximo de 500 caracteres"),
  ogImage: optionalUrl.max(500, "Máximo de 500 caracteres"),
});

export type CategoryFormValues = z.output<typeof categoryFormSchema>;
export type CategoryFormInput = z.input<typeof categoryFormSchema>;

export const categoryFormDefaultValues: CategoryFormInput = {
  name: "",
  slug: "",
  description: "",
  iconValue: "Boxes",
  displayOrder: 0,
  isActive: true,
  parentId: "",
  vehicleRequirement: String(VehicleRequirement.Required),
  showCompatibility: true,
  allowProfessionalRequest: true,
  searchKeywords: "",
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
};

export const CATEGORY_ICON_TYPE = CategoryIconType.Lucide;

export const VEHICLE_REQUIREMENT_OPTIONS: {
  value: VehicleRequirement;
  label: string;
}[] = [
  { value: VehicleRequirement.Required, label: "Obrigatório" },
  { value: VehicleRequirement.Optional, label: "Opcional" },
  { value: VehicleRequirement.Hidden, label: "Oculto" },
];
