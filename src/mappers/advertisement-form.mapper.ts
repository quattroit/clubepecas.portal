import type {
  CreateAdvertisementRequest,
  UpdateAdvertisementRequest,
} from "@/contracts/advertisements/requests";
import type { AdvertisementDetailDto } from "@/contracts/advertisements/responses";
import type {
  AdvertisementCategory,
  AdvertisementCondition,
} from "@/contracts/common/enums";
import type { AdvertisementFormValues } from "@/features/dashboard/schemas/advertisementFormSchema";
import { parsePriceInput } from "@/utils/parsePriceInput";

/**
 * Converte valores do formulário → CreateAdvertisementRequest (DTO da API).
 */
export function mapAdvertisementFormToCreateRequest(
  values: AdvertisementFormValues,
): CreateAdvertisementRequest {
  return mapAdvertisementFormToRequest(values);
}

/**
 * Converte valores do formulário → UpdateAdvertisementRequest (DTO da API).
 */
export function mapAdvertisementFormToUpdateRequest(
  values: AdvertisementFormValues,
): UpdateAdvertisementRequest {
  return mapAdvertisementFormToRequest(values);
}

/**
 * Detalhe da API (+ fotos) → valores do formulário (create/edit).
 */
export function mapAdvertisementDetailToFormValues(
  dto: AdvertisementDetailDto,
  photos: { url: string; displayOrder: number }[] = [],
): AdvertisementFormValues {
  return {
    title: dto.title,
    description: dto.description,
    category: String(dto.category),
    compatibilityDescription: dto.compatibilityDescription,
    condition: String(dto.condition),
    price: dto.price.toFixed(2).replace(".", ","),
    photoUrls: mapPhotosToFormUrls(photos),
  };
}

/**
 * Fotos da API → até 3 slots do formulário (ordenados por displayOrder).
 */
export function mapPhotosToFormUrls(
  photos: { url: string; displayOrder: number }[],
): [string, string, string] {
  const urls = [...photos]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 3)
    .map((photo) => photo.url);

  return [urls[0] ?? "", urls[1] ?? "", urls[2] ?? ""];
}

/**
 * URLs de foto preenchidas (endpoint separado: createPhoto).
 */
export function mapAdvertisementFormToPhotoUrls(
  values: AdvertisementFormValues,
): string[] {
  return values.photoUrls.map((url) => url.trim()).filter(Boolean);
}

function mapAdvertisementFormToRequest(
  values: AdvertisementFormValues,
): CreateAdvertisementRequest {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: Number(values.category) as AdvertisementCategory,
    compatibilityDescription: values.compatibilityDescription.trim(),
    condition: Number(values.condition) as AdvertisementCondition,
    price: parsePriceInput(values.price),
  };
}
