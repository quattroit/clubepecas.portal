import type {
  CreatePartRequestRequest,
  PartRequestDto,
  UpdatePartRequestRequest,
} from "@/contracts/part-requests";
import type {
  PartRequestFormInput,
  PartRequestFormValues,
} from "@/features/professional-buyer/schemas/partRequestFormSchema";

function mapFormToRequest(
  values: PartRequestFormValues,
): CreatePartRequestRequest {
  return {
    title: values.title,
    description: values.description.trim() ? values.description.trim() : null,
    vehicleBrandId: values.vehicleBrandId,
    vehicleModelId: values.vehicleModelId,
    manufacturingYear: Number(values.manufacturingYear),
    modelYear:
      values.modelYear != null ? Number(values.modelYear) : null,
    engine: values.engine.trim() ? values.engine.trim() : null,
    categoryId: values.categoryId,
    requestedQuantity: Number(values.requestedQuantity),
    cityId: values.cityId,
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
): PartRequestFormInput {
  return {
    title: dto.title,
    description: dto.description ?? "",
    categoryId: dto.categoryId,
    vehicleBrandId: String(dto.vehicleBrandId),
    vehicleModelId: String(dto.vehicleModelId),
    manufacturingYear: String(dto.manufacturingYear),
    modelYear: dto.modelYear != null ? String(dto.modelYear) : "",
    engine: dto.engine ?? "",
    requestedQuantity: String(dto.requestedQuantity),
    cityId: dto.cityId,
    maximumSuppliers: String(dto.maximumSuppliers),
  };
}
