import type {
  CreateAdvertisementRequest,
  UpdateAdvertisementRequest,
} from "@/contracts/advertisements/requests";
import type { AdvertisementDetailDto } from "@/contracts/advertisements/responses";
import type { AdvertisementCondition } from "@/contracts/common/enums";
import type {
  AdvertisementFormInput,
  AdvertisementFormValues,
} from "@/features/dashboard/schemas/advertisementFormSchema";
import type { Category } from "@/types/Category";
import { resolveRootCategory } from "@/utils/category-hierarchy";
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
 * Campos opcionais vazios usam "" para o select exibir "Selecione".
 * `categories` resolve a raiz a partir da subcategoria do anúncio.
 */
export function mapAdvertisementDetailToFormValues(
  dto: AdvertisementDetailDto,
  categories: Category[] = [],
): AdvertisementFormInput {
  const root = resolveRootCategory(categories, dto.categoryId);
  const rootCategoryId = root?.id ?? dto.categoryId;

  return {
    title: dto.title,
    description: dto.description,
    rootCategoryId,
    categoryId: dto.categoryId,
    vehicleBrandId: dto.vehicleBrandId ?? "",
    vehicleModelId: dto.vehicleModelId ?? "",
    manufacturingYear:
      dto.manufacturingYear != null ? String(dto.manufacturingYear) : "",
    modelYear: dto.modelYear != null ? String(dto.modelYear) : "",
    compatibilityDescription: dto.compatibilityDescription ?? "",
    condition: String(dto.condition),
    price: dto.price.toFixed(2).replace(".", ","),
    stockQuantity: String(dto.stockQuantity),
  };
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toOptionalId(value: number | string | null | undefined): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function toOptionalYear(value: string | null | undefined): number | null {
  if (value == null || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function mapAdvertisementFormToRequest(
  values: AdvertisementFormValues,
): CreateAdvertisementRequest {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    categoryId: Number(values.categoryId),
    vehicleBrandId: toOptionalId(values.vehicleBrandId),
    vehicleModelId: toOptionalId(values.vehicleModelId),
    manufacturingYear: toOptionalYear(values.manufacturingYear),
    modelYear: toOptionalYear(values.modelYear),
    compatibilityDescription: emptyToNull(values.compatibilityDescription),
    condition: Number(values.condition) as AdvertisementCondition,
    price: parsePriceInput(values.price),
    stockQuantity: Number(values.stockQuantity),
  };
}
