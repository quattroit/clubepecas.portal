import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Schema do formulário de modelo de veículo (criar/editar) — área administrativa.
 */
export const vehicleModelFormSchema = z.object({
  vehicleBrandId: z
    .string()
    .trim()
    .min(1, "Selecione a marca")
    .refine(
      (value) => z.uuid().safeParse(value).success,
      "Marca inválida",
    ),
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome do modelo")
    .max(100, "Máximo de 100 caracteres"),
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

export type VehicleModelFormValues = z.infer<typeof vehicleModelFormSchema>;

export const vehicleModelFormDefaultValues: VehicleModelFormValues = {
  vehicleBrandId: "",
  name: "",
  slug: "",
  displayOrder: 0,
  isActive: true,
};
