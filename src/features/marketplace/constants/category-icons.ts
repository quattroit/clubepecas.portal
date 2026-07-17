import {
  Armchair,
  Boxes,
  CarFront,
  CircleDot,
  Cog,
  MoveVertical,
  PackageOpen,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Definição visual de ícone de categoria.
 * Hoje: Lucide. Futuro: `{ type: "custom"; src: string }` para SVGs automotivos.
 */
export type CategoryIconDefinition =
  | {
      type: "lucide";
      icon: LucideIcon;
    }
  | {
      type: "custom";
      /** Caminho em /public (ex.: /images/categories/motor.svg) */
      src: string;
    };

/**
 * Mapa central por `iconName` (vindo de categoryMeta).
 * Adicionar nova categoria: 1) meta.iconName 2) entrada aqui.
 */
export const CATEGORY_ICONS: Record<string, CategoryIconDefinition> = {
  Cog: { type: "lucide", icon: Cog },
  Workflow: { type: "lucide", icon: Workflow },
  MoveVertical: { type: "lucide", icon: MoveVertical },
  CarFront: { type: "lucide", icon: CarFront },
  Zap: { type: "lucide", icon: Zap },
  Armchair: { type: "lucide", icon: Armchair },
  CircleDot: { type: "lucide", icon: CircleDot },
  PackageOpen: { type: "lucide", icon: PackageOpen },
  Boxes: { type: "lucide", icon: Boxes },
};

export const DEFAULT_CATEGORY_ICON: CategoryIconDefinition = {
  type: "lucide",
  icon: Boxes,
};

export function resolveCategoryIcon(
  iconName: string,
): CategoryIconDefinition {
  return CATEGORY_ICONS[iconName] ?? DEFAULT_CATEGORY_ICON;
}
