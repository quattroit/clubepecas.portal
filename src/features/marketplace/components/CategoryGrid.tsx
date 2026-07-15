import { CategoryCard } from "@/features/marketplace/components/CategoryCard";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/Category";

type CategoryGridProps = {
  categories: Category[];
  className?: string;
};

function CategoryGrid({ categories, className }: CategoryGridProps) {
  return (
    <ul
      className={cn(
        "grid list-none grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4",
        className,
      )}
      aria-label="Categorias"
    >
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryCard category={category} />
        </li>
      ))}
    </ul>
  );
}

export { CategoryGrid };
export type { CategoryGridProps };
