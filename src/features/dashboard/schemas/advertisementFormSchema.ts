import { z } from "zod";

import {
  AdvertisementCondition,
  VehicleRequirement,
} from "@/contracts/common/enums";
import { parsePriceInput } from "@/utils/parsePriceInput";
import {
  getVehicleYearMax,
  VEHICLE_YEAR_MIN,
} from "@/utils/vehicle-years";

/** Limites alinhados ao backend (`AdvertisementConfiguration`). */
export const ADVERTISEMENT_TITLE_MAX_LENGTH = 200;
export const ADVERTISEMENT_DESCRIPTION_MAX_LENGTH = 4000;
export const ADVERTISEMENT_COMPATIBILITY_MAX_LENGTH = 500;

const conditionOptions = Object.values(AdvertisementCondition)
  .filter((value): value is AdvertisementCondition => typeof value === "number")
  .map(String) as [string, ...string[]];

const entityIdField = (message: string) =>
  z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .pipe(z.number().int().positive(message));

/** Dropdown opcional no form: "" / 0 → null. */
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

/** Ano opcional: "" → null; valor preenchido deve ser válido. */
const optionalYearField = z
  .union([z.string(), z.null()])
  .transform((value) => {
    if (value == null) return null;
    const trimmed = String(value).trim();
    return trimmed === "" ? null : trimmed;
  })
  .refine(
    (value) => value === null || isValidVehicleYear(value),
    `Informe um ano entre ${VEHICLE_YEAR_MIN} e ${getVehicleYearMax()}`,
  );

export type AdvertisementCategoryFieldConfig = {
  vehicleRequirement: VehicleRequirement;
  showCompatibility: boolean;
};

const DEFAULT_FIELD_CONFIG: AdvertisementCategoryFieldConfig = {
  vehicleRequirement: VehicleRequirement.Required,
  showCompatibility: true,
};

/**
 * Schema compartilhado entre criar e editar anúncio.
 * `rootCategoryId` seleciona a raiz; `categoryId` é a subcategoria enviada à API.
 * Validação de veículo/compatibilidade depende da config da raiz (via factory).
 */
export function createAdvertisementFormSchema(
  getConfig: () => AdvertisementCategoryFieldConfig = () => DEFAULT_FIELD_CONFIG,
) {
  return z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Informe o título")
        .max(
          ADVERTISEMENT_TITLE_MAX_LENGTH,
          `Máximo de ${ADVERTISEMENT_TITLE_MAX_LENGTH} caracteres`,
        ),
      description: z
        .string()
        .trim()
        .min(1, "Informe a descrição")
        .max(
          ADVERTISEMENT_DESCRIPTION_MAX_LENGTH,
          `Máximo de ${ADVERTISEMENT_DESCRIPTION_MAX_LENGTH} caracteres`,
        ),
      rootCategoryId: entityIdField("Selecione a categoria"),
      categoryId: entityIdField("Selecione a subcategoria"),
      vehicleBrandId: optionalEntityIdField,
      vehicleModelId: optionalEntityIdField,
      manufacturingYear: optionalYearField,
      modelYear: optionalYearField,
      compatibilityDescription: z
        .string()
        .trim()
        .max(
          ADVERTISEMENT_COMPATIBILITY_MAX_LENGTH,
          `Máximo de ${ADVERTISEMENT_COMPATIBILITY_MAX_LENGTH} caracteres`,
        ),
      condition: z.enum(conditionOptions, {
        message: "Selecione a condição",
      }),
      price: z
        .string()
        .trim()
        .min(1, "Informe o preço")
        .refine((value) => !Number.isNaN(parsePriceInput(value)), "Preço inválido")
        .refine(
          (value) => parsePriceInput(value) > 0,
          "O preço deve ser maior que zero",
        ),
      stockQuantity: z
        .string()
        .trim()
        .min(1, "Informe a quantidade em estoque")
        .refine(
          (value) => Number.isInteger(Number(value)) && Number(value) >= 1,
          "A quantidade deve ser um número inteiro maior ou igual a 1",
        ),
    })
    .superRefine((values, ctx) => {
      const config = getConfig();
      const requiresVehicle =
        config.vehicleRequirement === VehicleRequirement.Required;
      const showsVehicle =
        config.vehicleRequirement !== VehicleRequirement.Hidden;

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

export const advertisementFormSchema = createAdvertisementFormSchema();

export type AdvertisementFormValues = z.output<
  ReturnType<typeof createAdvertisementFormSchema>
>;
export type AdvertisementFormInput = z.input<
  ReturnType<typeof createAdvertisementFormSchema>
>;

/** Defaults do formulário (input): selects vazios → "" → null no submit. */
export const advertisementFormDefaultValues: AdvertisementFormInput = {
  title: "",
  description: "",
  rootCategoryId: 0,
  categoryId: 0,
  vehicleBrandId: "",
  vehicleModelId: "",
  manufacturingYear: "",
  modelYear: "",
  compatibilityDescription: "",
  condition: String(AdvertisementCondition.Used),
  price: "",
  stockQuantity: "1",
};
