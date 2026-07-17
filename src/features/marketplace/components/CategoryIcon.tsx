import Image from "next/image";
import { createElement } from "react";

import {
  resolveCategoryIcon,
  type CategoryIconDefinition,
} from "@/features/marketplace/constants/category-icons";
import { cn } from "@/lib/utils";

type CategoryIconProps = {
  /** Nome do ícone (ex.: Cog) — resolvido pelo mapa central. */
  iconName: string;
  className?: string;
  /** Classe do ícone Lucide / imagem (padrão size-6). */
  iconClassName?: string;
};

/**
 * Renderiza o ícone de categoria conforme o mapa central.
 * Trocar Lucide por SVG customizado: alterar só category-icons.ts.
 */
function CategoryIcon({
  iconName,
  className,
  iconClassName = "size-6",
}: CategoryIconProps) {
  const definition = resolveCategoryIcon(iconName);

  return (
    <span
      className={cn(
        "bg-primary/8 text-primary border-primary/15 flex size-14 shrink-0 items-center justify-center rounded-2xl border transition-all duration-200 ease-out",
        "group-hover/card:bg-primary/15 group-hover/card:border-primary/30",
        "group-hover/card:[&_svg]:scale-105",
        className,
      )}
      aria-hidden
    >
      <CategoryIconGraphic
        definition={definition}
        className={cn(
          "transition-transform duration-200 ease-out",
          iconClassName,
        )}
      />
    </span>
  );
}

function CategoryIconGraphic({
  definition,
  className,
}: {
  definition: CategoryIconDefinition;
  className?: string;
}) {
  if (definition.type === "custom") {
    return (
      <Image
        src={definition.src}
        alt=""
        width={24}
        height={24}
        className={cn("object-contain", className)}
      />
    );
  }

  return createElement(definition.icon, {
    className,
    strokeWidth: 2,
    "aria-hidden": true,
  });
}

export { CategoryIcon };
export type { CategoryIconProps };
