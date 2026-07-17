import type { LucideIcon } from "lucide-react";
import { Boxes } from "lucide-react";

import { resolveCategoryIcon } from "@/features/marketplace/constants/category-icons";

/**
 * Resolve LucideIcon pelo `iconName` da categoria.
 * Preferir `<CategoryIcon />` em UIs novas.
 */
export function getCategoryIcon(iconName: string): LucideIcon {
  const definition = resolveCategoryIcon(iconName);
  return definition.type === "lucide" ? definition.icon : Boxes;
}
