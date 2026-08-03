import type {
  AdminCategoryListItemDto,
  CreateAdminCategoryRequest,
  UpdateAdminCategoryRequest,
} from "@/contracts/admin/categories";
import {
  CategoryIconType,
  VehicleRequirement,
} from "@/contracts/common/enums";
import type {
  CategoryFormInput,
  CategoryFormValues,
} from "@/features/admin/schemas/categoryFormSchema";

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * Categoria administrativa (API) → valores do formulário.
 */
export function mapAdminCategoryToForm(
  category: AdminCategoryListItemDto,
): CategoryFormInput {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    iconValue: category.iconValue,
    displayOrder: category.displayOrder,
    isActive: category.isActive,
    parentId: category.parentId ?? "",
    vehicleRequirement: String(
      category.vehicleRequirement ?? VehicleRequirement.Required,
    ),
    showCompatibility: category.showCompatibility ?? true,
    allowProfessionalRequest: category.allowProfessionalRequest ?? true,
    searchKeywords: category.searchKeywords ?? "",
    metaTitle: category.metaTitle ?? "",
    metaDescription: category.metaDescription ?? "",
    ogImage: category.ogImage ?? "",
  };
}

function mapCategoryFormConfigFields(
  values: CategoryFormValues,
): Pick<
  CreateAdminCategoryRequest,
  | "parentId"
  | "vehicleRequirement"
  | "showCompatibility"
  | "allowProfessionalRequest"
  | "searchKeywords"
> {
  const parentId = values.parentId;
  if (parentId != null) {
    return { parentId };
  }

  return {
    parentId: null,
    vehicleRequirement: Number(values.vehicleRequirement) as VehicleRequirement,
    showCompatibility: values.showCompatibility,
    allowProfessionalRequest: values.allowProfessionalRequest,
    searchKeywords: emptyToNull(values.searchKeywords),
  };
}

/**
 * Formulário → payload de criação (POST /admin/categories).
 */
export function mapCategoryFormToCreateRequest(
  values: CategoryFormValues,
): CreateAdminCategoryRequest {
  return {
    name: values.name.trim(),
    slug: emptyToUndefined(values.slug),
    description: emptyToUndefined(values.description),
    displayOrder: values.displayOrder,
    iconType: CategoryIconType.Lucide,
    iconValue: values.iconValue.trim(),
    isActive: values.isActive,
    metaTitle: emptyToUndefined(values.metaTitle),
    metaDescription: emptyToUndefined(values.metaDescription),
    ogImage: emptyToUndefined(values.ogImage),
    ...mapCategoryFormConfigFields(values),
  };
}

/**
 * Formulário → payload de atualização (PUT /admin/categories/{id}).
 * `isActive` é gerenciado separadamente (PUT .../status).
 */
export function mapCategoryFormToUpdateRequest(
  values: CategoryFormValues,
): UpdateAdminCategoryRequest {
  return {
    name: values.name.trim(),
    slug: emptyToUndefined(values.slug),
    description: emptyToUndefined(values.description),
    displayOrder: values.displayOrder,
    iconType: CategoryIconType.Lucide,
    iconValue: values.iconValue.trim(),
    metaTitle: emptyToUndefined(values.metaTitle),
    metaDescription: emptyToUndefined(values.metaDescription),
    ogImage: emptyToUndefined(values.ogImage),
    ...mapCategoryFormConfigFields(values),
  };
}
