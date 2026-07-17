import type {
  AdminCategoryListItemDto,
  CreateAdminCategoryRequest,
  UpdateAdminCategoryRequest,
} from "@/contracts/admin/categories";
import { CategoryIconType } from "@/contracts/common/enums";
import type { CategoryFormValues } from "@/features/admin/schemas/categoryFormSchema";

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Categoria administrativa (API) → valores do formulário.
 */
export function mapAdminCategoryToForm(
  category: AdminCategoryListItemDto,
): CategoryFormValues {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    iconValue: category.iconValue,
    displayOrder: category.displayOrder,
    isActive: category.isActive,
    metaTitle: category.metaTitle ?? "",
    metaDescription: category.metaDescription ?? "",
    ogImage: category.ogImage ?? "",
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
  };
}
