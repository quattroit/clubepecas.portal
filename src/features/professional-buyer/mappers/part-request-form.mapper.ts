import type {
  CreatePartRequestRequest,
  PartRequestDto,
  UpdatePartRequestRequest,
} from "@/contracts/part-requests";
import type {
  PartRequestFormInput,
  PartRequestFormValues,
} from "@/features/professional-buyer/schemas/partRequestFormSchema";
import type { Category } from "@/types/Category";
import { resolveRootCategory } from "@/utils/category-hierarchy";

function toOptionalId(value: number | null | undefined): number | null {
  if (value == null || value <= 0) return null;
  return value;
}

function toOptionalYear(value: string | null | undefined): number | null {
  if (value == null || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function mapFormToRequest(
  values: PartRequestFormValues,
): CreatePartRequestRequest {
  return {
    title: values.title,
    description: values.description.trim() ? values.description.trim() : null,
    vehicleBrandId: toOptionalId(values.vehicleBrandId),
    vehicleModelId: toOptionalId(values.vehicleModelId),
    manufacturingYear: toOptionalYear(values.manufacturingYear),
    modelYear: toOptionalYear(values.modelYear),
    engine: values.engine.trim() ? values.engine.trim() : null,
    categoryId: values.categoryId,
    requestedQuantity: Number(values.requestedQuantity),
    cityId: toOptionalId(values.cityId),
    maximumSuppliers: Number(values.maximumSuppliers),
  };
}

export function mapPartRequestFormToCreateRequest(
  values: PartRequestFormValues,
): CreatePartRequestRequest {
  return mapFormToRequest(values);
}

export function mapPartRequestFormToUpdateRequest(
  values: PartRequestFormValues,
): UpdatePartRequestRequest {
  return mapFormToRequest(values);
}

export function mapPartRequestDtoToFormInput(
  dto: PartRequestDto,
  categories: Category[] = [],
): PartRequestFormInput {
  const root = resolveRootCategory(categories, dto.categoryId);
  const rootCategoryId = root?.id ?? dto.categoryId;

  return {
    title: dto.title,
    description: dto.description ?? "",
    rootCategoryId,
    categoryId: dto.categoryId,
    vehicleBrandId: dto.vehicleBrandId ? String(dto.vehicleBrandId) : "",
    vehicleModelId: dto.vehicleModelId ? String(dto.vehicleModelId) : "",
    manufacturingYear: dto.manufacturingYear
      ? String(dto.manufacturingYear)
      : "",
    modelYear: dto.modelYear != null ? String(dto.modelYear) : "",
    engine: dto.engine ?? "",
    requestedQuantity: String(dto.requestedQuantity),
    cityId: dto.cityId ? String(dto.cityId) : "",
    maximumSuppliers: String(dto.maximumSuppliers),
  };
}
