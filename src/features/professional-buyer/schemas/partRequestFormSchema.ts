import { z } from "zod";

import {
  getVehicleYearMax,
  VEHICLE_YEAR_MIN,
} from "@/utils/vehicle-years";

/** Limites alinhados ao backend (`PartRequest`). */
export const PART_REQUEST_TITLE_MAX_LENGTH = 200;
export const PART_REQUEST_DESCRIPTION_MAX_LENGTH = 4000;
export const PART_REQUEST_ENGINE_MAX_LENGTH = 100;
export const PART_REQUEST_MIN_SUPPLIERS = 1;
export const PART_REQUEST_MAX_SUPPLIERS = 10;
export const PART_REQUEST_DEFAULT_MAX_SUPPLIERS = 5;

const entityIdField = (message: string) =>
  z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .pipe(z.number().int().positive(message));

function isValidVehicleYear(value: string): boolean {
  const year = Number(value);
  return (
    Number.isInteger(year) &&
    year >= VEHICLE_YEAR_MIN &&
    year <= getVehicleYearMax()
  );
}

const requiredYearField = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .refine((value) => value.length > 0, "Informe o ano de fabricação")
  .refine(
    isValidVehicleYear,
    `Informe um ano entre ${VEHICLE_YEAR_MIN} e ${getVehicleYearMax()}`,
  );

const optionalYearField = z
  .union([z.string(), z.number(), z.null()])
  .transform((value) => {
    if (value == null) return null;
    const trimmed = String(value).trim();
    return trimmed === "" ? null : trimmed;
  })
  .refine(
    (value) => value === null || isValidVehicleYear(value),
    `Informe um ano entre ${VEHICLE_YEAR_MIN} e ${getVehicleYearMax()}`,
  );

const supplierOptions = Array.from(
  { length: PART_REQUEST_MAX_SUPPLIERS },
  (_, index) => String(index + 1),
) as [string, ...string[]];

export const partRequestFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Informe o título")
    .max(
      PART_REQUEST_TITLE_MAX_LENGTH,
      `Máximo de ${PART_REQUEST_TITLE_MAX_LENGTH} caracteres`,
    ),
  description: z
    .string()
    .trim()
    .max(
      PART_REQUEST_DESCRIPTION_MAX_LENGTH,
      `Máximo de ${PART_REQUEST_DESCRIPTION_MAX_LENGTH} caracteres`,
    ),
  categoryId: entityIdField("Selecione a categoria"),
  vehicleBrandId: entityIdField("Selecione a marca"),
  vehicleModelId: entityIdField("Selecione o modelo"),
  manufacturingYear: requiredYearField,
  modelYear: optionalYearField,
  engine: z
    .string()
    .trim()
    .max(
      PART_REQUEST_ENGINE_MAX_LENGTH,
      `Máximo de ${PART_REQUEST_ENGINE_MAX_LENGTH} caracteres`,
    ),
  requestedQuantity: z
    .string()
    .trim()
    .min(1, "Informe a quantidade")
    .refine(
      (value) => Number.isInteger(Number(value)) && Number(value) > 0,
      "A quantidade deve ser maior que zero",
    ),
  cityId: entityIdField("Selecione a cidade"),
  maximumSuppliers: z.enum(supplierOptions, {
    message: "Selecione a quantidade de fornecedores",
  }),
});

export type PartRequestFormValues = z.output<typeof partRequestFormSchema>;
export type PartRequestFormInput = z.input<typeof partRequestFormSchema>;

export const partRequestFormDefaultValues: PartRequestFormInput = {
  title: "",
  description: "",
  categoryId: 0,
  vehicleBrandId: "",
  vehicleModelId: "",
  manufacturingYear: "",
  modelYear: "",
  engine: "",
  requestedQuantity: "1",
  cityId: 0,
  maximumSuppliers: String(PART_REQUEST_DEFAULT_MAX_SUPPLIERS),
};
