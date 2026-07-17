import { z } from "zod";

import { AdvertisementCondition } from "@/contracts/common/enums";
import { parsePriceInput } from "@/utils/parsePriceInput";

const conditionOptions = Object.values(AdvertisementCondition)
  .filter((value): value is AdvertisementCondition => typeof value === "number")
  .map(String) as [string, ...string[]];

const optionalPhotoUrl = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || z.url().safeParse(value).success,
    "Informe uma URL válida (https://…)",
  );

/**
 * Schema compartilhado entre criar e editar anúncio.
 * Campos alinhados a CreateAdvertisementRequest / UpdateAdvertisementRequest.
 * photoUrls fica fora do contrato de create/update — usa endpoints …/photos.
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
  photoUrls: z.array(optionalPhotoUrl).max(3),
});

export type AdvertisementFormValues = z.infer<typeof advertisementFormSchema>;

export const advertisementFormDefaultValues: AdvertisementFormValues = {
  title: "",
  description: "",
  categoryId: "",
  vehicleBrandId: "",
  vehicleModelId: "",
  compatibilityDescription: "",
  condition: String(AdvertisementCondition.Used),
  price: "",
  stockQuantity: "1",
  photoUrls: ["", "", ""],
};
