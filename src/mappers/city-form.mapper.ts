import type {
  AdminCityListItemDto,
  CreateAdminCityRequest,
  UpdateAdminCityRequest,
} from "@/contracts/admin/cities";
import type { CityFormValues } from "@/features/admin/schemas/cityFormSchema";

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Cidade administrativa (API) → valores do formulário.
 */
export function mapAdminCityToForm(city: AdminCityListItemDto): CityFormValues {
  return {
    name: city.name,
    state: city.state,
    slug: city.slug,
    displayOrder: city.displayOrder,
    isActive: city.isActive,
  };
}

/**
 * Formulário → payload de criação (POST /admin/cities).
 */
export function mapCityFormToCreateRequest(
  values: CityFormValues,
): CreateAdminCityRequest {
  return {
    name: values.name.trim(),
    state: values.state.trim().toUpperCase(),
    slug: emptyToUndefined(values.slug),
    displayOrder: values.displayOrder,
    isActive: values.isActive,
  };
}

/**
 * Formulário → payload de atualização (PUT /admin/cities/{id}).
 * `isActive` é gerenciado separadamente (PUT .../status).
 */
export function mapCityFormToUpdateRequest(
  values: CityFormValues,
): UpdateAdminCityRequest {
  return {
    name: values.name.trim(),
    state: values.state.trim().toUpperCase(),
    slug: emptyToUndefined(values.slug),
    displayOrder: values.displayOrder,
  };
}
