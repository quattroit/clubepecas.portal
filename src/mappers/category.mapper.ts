import { AdvertisementCategory } from "@/contracts/common/enums";
import { ADVERTISEMENT_CATEGORY_META } from "@/mappers/categoryMeta";
import type { Category } from "@/types/Category";

/**
 * Categorias do marketplace são o enum do backend.
 * Este mapper materializa o enum nos modelos de UI.
 */
export function mapAdvertisementCategoriesToCategories(): Category[] {
  return Object.values(AdvertisementCategory)
    .filter(
      (value): value is AdvertisementCategory => typeof value === "number",
    )
    .map((value) => {
      const meta = ADVERTISEMENT_CATEGORY_META[value];
      return {
        id: String(value),
        slug: meta.slug,
        name: meta.name,
        advertisementCount: 0,
        iconName: meta.iconName,
        description: meta.description,
      } satisfies Category;
    });
}

export function mapCategoryEnumToCategory(
  category: AdvertisementCategory,
  advertisementCount = 0,
): Category {
  const meta = ADVERTISEMENT_CATEGORY_META[category];
  return {
    id: String(category),
    slug: meta.slug,
    name: meta.name,
    advertisementCount,
    iconName: meta.iconName,
    description: meta.description,
  };
}

/** Resolve categoria pelo slug público (enum + meta). */
export function getCategoryBySlug(slug: string): Category | undefined {
  return mapAdvertisementCategoriesToCategories().find(
    (category) => category.slug === slug,
  );
}

/** Enum numérico a partir do slug. */
export function getCategoryEnumBySlug(
  slug: string,
): AdvertisementCategory | undefined {
  const category = getCategoryBySlug(slug);
  if (!category) return undefined;
  return Number(category.id) as AdvertisementCategory;
}

/** Slugs para generateStaticParams. */
export function listCategorySlugs(): string[] {
  return mapAdvertisementCategoriesToCategories().map(
    (category) => category.slug,
  );
}

/**
 * Enriquece categorias com contagem a partir de anúncios já mapeados (UI).
 */
export function mapCategoriesWithAdvertisementCounts(
  categories: Category[],
  advertisementCategoryLabels: string[],
): Category[] {
  const counts = new Map<string, number>();

  for (const label of advertisementCategoryLabels) {
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return categories.map((category) => ({
    ...category,
    advertisementCount: counts.get(category.name) ?? 0,
  }));
}
