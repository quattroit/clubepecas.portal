import type {
  AdminVehicleBrandListItemDto,
  CreateAdminVehicleBrandRequest,
  UpdateAdminVehicleBrandRequest,
} from "@/contracts/admin/vehicle-brands";
import type { VehicleBrandFormValues } from "@/features/admin/schemas/vehicleBrandFormSchema";

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Marca administrativa (API) → valores do formulário.
 */
export function mapAdminVehicleBrandToForm(
  brand: AdminVehicleBrandListItemDto,
): VehicleBrandFormValues {
  return {
    name: brand.name,
    slug: brand.slug,
    displayOrder: brand.displayOrder,
    isActive: brand.isActive,
  };
}

/**
 * Formulário → payload de criação (POST /admin/vehicle-brands).
 */
export function mapVehicleBrandFormToCreateRequest(
  values: VehicleBrandFormValues,
): CreateAdminVehicleBrandRequest {
  return {
    name: values.name.trim(),
    slug: emptyToUndefined(values.slug),
    displayOrder: values.displayOrder,
    isActive: values.isActive,
  };
}

/**
 * Formulário → payload de atualização (PUT /admin/vehicle-brands/{id}).
 * `isActive` é gerenciado separadamente (PUT .../status).
 */
export function mapVehicleBrandFormToUpdateRequest(
  values: VehicleBrandFormValues,
): UpdateAdminVehicleBrandRequest {
  return {
    name: values.name.trim(),
    slug: emptyToUndefined(values.slug),
    displayOrder: values.displayOrder,
  };
}
