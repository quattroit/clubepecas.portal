import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { categoryPath } from "@/constants/routes";
import { CategoryIcon } from "@/features/marketplace/components/CategoryIcon";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/Category";

type CategoryCardProps = {
  category: Category;
  className?: string;
};

function CategoryCard({ category, className }: CategoryCardProps) {
  const { name, advertisementCount, iconName, slug } = category;
  const adsLabel =
    advertisementCount === 1 ? "1 anúncio" : `${advertisementCount} anúncios`;

  return (
    <Link
      href={categoryPath(slug)}
      className={cn(
        "focus-visible:ring-ring group/card block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
      )}
      aria-label={`Ver categoria ${name}`}
    >
      <Card
        size="sm"
        className="card-interactive h-full rounded-2xl transition-all duration-200 ease-out group-hover/card:shadow-md"
      >
        <CardContent className="flex flex-col items-center gap-2.5 py-5 text-center">
          <CategoryIcon iconName={iconName} />
          <h3 className="text-foreground text-sm leading-snug font-semibold">
            {name}
          </h3>
          <p className="text-muted-foreground text-xs">{adsLabel}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export { CategoryCard };
export type { CategoryCardProps };
