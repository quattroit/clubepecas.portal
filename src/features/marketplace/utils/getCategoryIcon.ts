import {
  Car,
  CircleStop,
  Cog,
  Disc,
  Filter,
  Lightbulb,
  MoveVertical,
  Package,
  Zap,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Car,
  CircleStop,
  Cog,
  Disc,
  Filter,
  Lightbulb,
  MoveVertical,
  Package,
  Zap,
};

/**
 * Resolve um ícone Lucide pelo nome. Fallback: Package.
 */
export function getCategoryIcon(iconName: string): LucideIcon {
  return iconMap[iconName] ?? Package;
}
