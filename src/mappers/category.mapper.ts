import type { PublicCategoryListItemDto } from "@/contracts/categories/responses";
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
  };
}

export function mapCategoryItemsToCategories(
  items: PublicCategoryListItemDto[],
): Category[] {
  return items.map(mapCategoryItemToCategory);
}

/** Resolve categoria pelo slug público, dentro de uma lista já carregada. */
export function findCategoryBySlug(
  categories: Category[],
  slug: string,
): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
