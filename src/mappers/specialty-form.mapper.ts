import type {
  AdminSpecialtyListItemDto,
  CreateAdminSpecialtyRequest,
  UpdateAdminSpecialtyRequest,
} from "@/contracts/admin/specialties";
import type { SpecialtyFormValues } from "@/features/admin/schemas/specialtyFormSchema";

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export function mapAdminSpecialtyToForm(
  specialty: AdminSpecialtyListItemDto,
): SpecialtyFormValues {
  return {
    name: specialty.name,
    slug: specialty.slug,
    displayOrder: specialty.displayOrder,
    isActive: specialty.isActive,
  };
}

export function mapSpecialtyFormToCreateRequest(
  values: SpecialtyFormValues,
): CreateAdminSpecialtyRequest {
  return {
    name: values.name.trim(),
    slug: emptyToUndefined(values.slug),
    displayOrder: values.displayOrder,
    isActive: values.isActive,
  };
}

export function mapSpecialtyFormToUpdateRequest(
  values: SpecialtyFormValues,
): UpdateAdminSpecialtyRequest {
  return {
    name: values.name.trim(),
    slug: emptyToUndefined(values.slug),
    displayOrder: values.displayOrder,
  };
}
