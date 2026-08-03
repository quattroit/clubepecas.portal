import { z } from "zod";

import { VehicleRequirement } from "@/contracts/common/enums";
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

/** Dropdown opcional: "" / 0 → null. */
const optionalEntityIdField = z
  .union([z.string(), z.number(), z.null()])
  .transform((value) => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) return null;
    return parsed;
  });

function isValidVehicleYear(value: string): boolean {
  const year = Number(value);
  return (
    Number.isInteger(year) &&
    year >= VEHICLE_YEAR_MIN &&
    year <= getVehicleYearMax()
  );
}

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

export type PartRequestCategoryFieldConfig = {
  vehicleRequirement: VehicleRequirement;
};

const DEFAULT_FIELD_CONFIG: PartRequestCategoryFieldConfig = {
  vehicleRequirement: VehicleRequirement.Required,
};

/**
 * Schema do formulário de solicitação de peças.
 * `rootCategoryId` → raiz; `categoryId` → subcategoria enviada à API.
 */
export function createPartRequestFormSchema(
  getConfig: () => PartRequestCategoryFieldConfig = () => DEFAULT_FIELD_CONFIG,
) {
  return z
    .object({
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
      rootCategoryId: entityIdField("Selecione a categoria"),
      categoryId: entityIdField("Selecione a subcategoria"),
      vehicleBrandId: optionalEntityIdField,
      vehicleModelId: optionalEntityIdField,
      manufacturingYear: optionalYearField,
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
    })
    .superRefine((values, ctx) => {
      const { vehicleRequirement } = getConfig();
      const requiresVehicle =
        vehicleRequirement === VehicleRequirement.Required;
      const showsVehicle = vehicleRequirement !== VehicleRequirement.Hidden;

      if (showsVehicle && values.vehicleModelId != null && values.vehicleBrandId == null) {
        ctx.addIssue({
          code: "custom",
          path: ["vehicleBrandId"],
          message: "Selecione a marca ao informar o modelo",
        });
      }

      if (requiresVehicle) {
        if (values.vehicleBrandId == null) {
          ctx.addIssue({
            code: "custom",
            path: ["vehicleBrandId"],
            message: "Selecione a marca",
          });
        }
        if (values.vehicleModelId == null) {
          ctx.addIssue({
            code: "custom",
            path: ["vehicleModelId"],
            message: "Selecione o modelo",
          });
        }
        if (values.manufacturingYear == null) {
          ctx.addIssue({
            code: "custom",
            path: ["manufacturingYear"],
            message: "Informe o ano de fabricação",
          });
        }
      }
    });
}

export const partRequestFormSchema = createPartRequestFormSchema();

export type PartRequestFormValues = z.output<
  ReturnType<typeof createPartRequestFormSchema>
>;
export type PartRequestFormInput = z.input<
  ReturnType<typeof createPartRequestFormSchema>
>;

export const partRequestFormDefaultValues: PartRequestFormInput = {
  title: "",
  description: "",
  rootCategoryId: 0,
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
