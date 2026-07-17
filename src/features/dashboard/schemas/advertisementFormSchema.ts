import { z } from "zod";

import { AdvertisementCondition } from "@/contracts/common/enums";
import { parsePriceInput } from "@/utils/parsePriceInput";
import {
  getVehicleYearMax,
  VEHICLE_YEAR_MIN,
} from "@/utils/vehicle-years";

const conditionOptions = Object.values(AdvertisementCondition)
  .filter((value): value is AdvertisementCondition => typeof value === "number")
  .map(String) as [string, ...string[]];

function isValidVehicleYear(value: string): boolean {
  const year = Number(value);
  return (
    Number.isInteger(year) &&
    year >= VEHICLE_YEAR_MIN &&
    year <= getVehicleYearMax()
  );
}

/**
 * Schema compartilhado entre criar e editar anúncio.
 * Campos alinhados a CreateAdvertisementRequest / UpdateAdvertisementRequest.
 * Fotos usam upload multipart em endpoint dedicado (não fazem parte deste schema).
 */
export const advertisementFormSchema = z.object({
  title: z.string().trim().min(1, "Informe o título"),
  description: z.string().trim().min(1, "Informe a descrição"),
  categoryId: z
    .string()
    .trim()
    .min(1, "Selecione a categoria")
    .refine(
      (value) => z.uuid().safeParse(value).success,
      "Categoria inválida",
    ),
  vehicleBrandId: z
    .string()
    .trim()
    .min(1, "Selecione a marca")
    .refine(
      (value) => z.uuid().safeParse(value).success,
      "Marca inválida",
    ),
  vehicleModelId: z
    .string()
    .trim()
    .min(1, "Selecione o modelo")
    .refine(
      (value) => z.uuid().safeParse(value).success,
      "Modelo inválido",
    ),
  manufacturingYear: z
    .string()
    .trim()
    .min(1, "Selecione o ano de fabricação")
    .refine(
      isValidVehicleYear,
      `Informe um ano entre ${VEHICLE_YEAR_MIN} e ${getVehicleYearMax()}`,
    ),
  modelYear: z
    .string()
    .trim()
    .min(1, "Selecione o ano/modelo")
    .refine(
      isValidVehicleYear,
      `Informe um ano entre ${VEHICLE_YEAR_MIN} e ${getVehicleYearMax()}`,
    ),
  compatibilityDescription: z
    .string()
    .trim()
    .min(1, "Informe a compatibilidade"),
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
});

export type AdvertisementFormValues = z.infer<typeof advertisementFormSchema>;

const currentYear = String(new Date().getFullYear());

export const advertisementFormDefaultValues: AdvertisementFormValues = {
  title: "",
  description: "",
  categoryId: "",
  vehicleBrandId: "",
  vehicleModelId: "",
  manufacturingYear: currentYear,
  modelYear: currentYear,
  compatibilityDescription: "",
  condition: String(AdvertisementCondition.Used),
  price: "",
  stockQuantity: "1",
};
