import type {
  CreateAdvertisementRequest,
  UpdateAdvertisementRequest,
} from "@/contracts/advertisements/requests";
import type { AdvertisementDetailDto } from "@/contracts/advertisements/responses";
import type { AdvertisementCondition } from "@/contracts/common/enums";
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
    categoryId: dto.categoryId,
    vehicleBrandId: dto.vehicleBrandId,
    vehicleModelId: dto.vehicleModelId ?? "",
    manufacturingYear: String(dto.manufacturingYear),
    modelYear: String(dto.modelYear),
    compatibilityDescription: dto.compatibilityDescription,
    condition: String(dto.condition),
    price: dto.price.toFixed(2).replace(".", ","),
    stockQuantity: String(dto.stockQuantity),
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
    categoryId: values.categoryId,
    vehicleBrandId: values.vehicleBrandId,
    vehicleModelId: values.vehicleModelId,
    manufacturingYear: Number(values.manufacturingYear),
    modelYear: Number(values.modelYear),
    compatibilityDescription: values.compatibilityDescription.trim(),
    condition: Number(values.condition) as AdvertisementCondition,
    price: parsePriceInput(values.price),
    stockQuantity: Number(values.stockQuantity),
  };
}
