import type {
  AdminVehicleModelListItemDto,
  CreateAdminVehicleModelRequest,
  UpdateAdminVehicleModelRequest,
} from "@/contracts/admin/vehicle-models";
import type { VehicleModelFormValues } from "@/features/admin/schemas/vehicleModelFormSchema";

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Modelo administrativo (API) → valores do formulário.
 */
export function mapAdminVehicleModelToForm(
  model: AdminVehicleModelListItemDto,
): VehicleModelFormValues {
  return {
    vehicleBrandId: model.vehicleBrandId,
    name: model.name,
    slug: model.slug,
    displayOrder: model.displayOrder,
    isActive: model.isActive,
  };
}

/**
 * Formulário → payload de criação (POST /admin/vehicle-models).
 */
export function mapVehicleModelFormToCreateRequest(
  values: VehicleModelFormValues,
): CreateAdminVehicleModelRequest {
  return {
    vehicleBrandId: values.vehicleBrandId,
    name: values.name.trim(),
    slug: emptyToUndefined(values.slug),
    displayOrder: values.displayOrder,
    isActive: values.isActive,
  };
}

/**
 * Formulário → payload de atualização (PUT /admin/vehicle-models/{id}).
 * `isActive` é gerenciado separadamente (PUT .../status).
 */
export function mapVehicleModelFormToUpdateRequest(
  values: VehicleModelFormValues,
): UpdateAdminVehicleModelRequest {
  return {
    vehicleBrandId: values.vehicleBrandId,
    name: values.name.trim(),
    slug: emptyToUndefined(values.slug),
    displayOrder: values.displayOrder,
  };
}
