/**
 * Helpers de hierarquia de categorias (raiz → filhas).
 */

type WithParentId = {
  id: number;
  parentId?: number | null;
  displayOrder?: number;
  name?: string;
};

/** Categorias raiz (`parentId` nulo). */
export function getRootCategories<T extends WithParentId>(categories: T[]): T[] {
  return categories.filter((category) => category.parentId == null);
}

/** Filhas diretas de um pai. */
export function getChildCategories<T extends WithParentId>(
  categories: T[],
  parentId: number,
): T[] {
  return categories.filter((category) => category.parentId === parentId);
}

/** Resolve a raiz a partir de qualquer nó (próprio id se já for raiz). */
export function resolveRootCategory<T extends WithParentId>(
  categories: T[],
  categoryId: number,
): T | undefined {
  const category = categories.find((item) => item.id === categoryId);
  if (!category) return undefined;
  if (category.parentId == null) return category;
  return categories.find((item) => item.id === category.parentId);
}

/**
 * Ordena para exibição hierárquica: cada raiz seguida das suas filhas.
 * Mantém a ordem relativa de `displayOrder` / nome dentro de cada nível.
 */
export function sortCategoriesHierarchically<T extends WithParentId>(
  categories: T[],
): T[] {
  const byOrder = (a: T, b: T) => {
    const orderA = a.displayOrder ?? 0;
    const orderB = b.displayOrder ?? 0;
    if (orderA !== orderB) return orderA - orderB;
    return (a.name ?? "").localeCompare(b.name ?? "", "pt-BR");
  };

  const roots = getRootCategories(categories).sort(byOrder);
  const result: T[] = [];

  for (const root of roots) {
    result.push(root);
    result.push(...getChildCategories(categories, root.id).sort(byOrder));
  }

  // Órfãos (pai inexistente) no final, para não sumirem da listagem.
  const listedIds = new Set(result.map((item) => item.id));
  const orphans = categories
    .filter((item) => !listedIds.has(item.id))
    .sort(byOrder);
  result.push(...orphans);

  return result;
}
