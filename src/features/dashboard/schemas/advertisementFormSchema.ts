import { z } from "zod";

import {
  AdvertisementCategory,
  AdvertisementCondition,
} from "@/contracts/common/enums";
import { parsePriceInput } from "@/utils/parsePriceInput";

const categoryOptions = Object.values(AdvertisementCategory)
  .filter((value): value is AdvertisementCategory => typeof value === "number")
  .map(String) as [string, ...string[]];

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
  category: z.enum(categoryOptions, {
    message: "Selecione a categoria",
  }),
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
  photoUrls: z.array(optionalPhotoUrl).max(3),
});

export type AdvertisementFormValues = z.infer<typeof advertisementFormSchema>;

export const advertisementFormDefaultValues: AdvertisementFormValues = {
  title: "",
  description: "",
  category: String(AdvertisementCategory.Other),
  compatibilityDescription: "",
  condition: String(AdvertisementCondition.Used),
  price: "",
  photoUrls: ["", "", ""],
};
