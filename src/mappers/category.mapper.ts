import type { PublicCategoryListItemDto } from "@/contracts/categories/responses";
import { VehicleRequirement } from "@/contracts/common/enums";
import type { Category } from "@/types/Category";

/**
 * Categorias vêm do CRUD administrativo (GET /api/v1/categories).
 * Este mapper converte os DTOs da API para o modelo de UI.
 */
export function mapCategoryItemToCategory(
  item: PublicCategoryListItemDto,
): Category {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    advertisementCount: item.advertisementCount,
    iconName: item.iconValue,
    description: item.description ?? undefined,
    parentId: item.parentId ?? null,
    vehicleRequirement: item.vehicleRequirement ?? VehicleRequirement.Required,
    showCompatibility: item.showCompatibility ?? true,
    allowProfessionalRequest: item.allowProfessionalRequest ?? true,
    searchKeywords: item.searchKeywords ?? null,
  };
}

/**
 * A API retorna árvore (raízes com `children`). Achata para lista com `parentId`,
 * usada por `getRootCategories` / `getChildCategories` nos formulários.
 */
export function mapCategoryItemsToCategories(
  items: PublicCategoryListItemDto[],
): Category[] {
  const result: Category[] = [];

  for (const item of items) {
    result.push(mapCategoryItemToCategory(item));
    for (const child of item.children ?? []) {
      result.push(
        mapCategoryItemToCategory({
          ...child,
          parentId: child.parentId ?? item.id,
        }),
      );
    }
  }

  return result;
}

/** Resolve categoria pelo slug público, dentro de uma lista já carregada. */
export function findCategoryBySlug(
  categories: Category[],
  slug: string,
): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
