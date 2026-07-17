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
 * Detalhe da API → valores do formulário (create/edit).
 * Fotos são gerenciadas fora do formulário via upload multipart.
 */
export function mapAdvertisementDetailToFormValues(
  dto: AdvertisementDetailDto,
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
  };
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
