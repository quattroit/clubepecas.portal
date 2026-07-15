import { createElement } from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { categoryPath } from "@/constants/routes";
import { getCategoryIcon } from "@/features/marketplace/utils/getCategoryIcon";
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
        "focus-visible:ring-ring block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
      )}
      aria-label={`Ver categoria ${name}`}
    >
      <Card
        size="sm"
        className="h-full shadow-xs transition-shadow hover:shadow-sm"
      >
        <CardContent className="flex flex-col items-center gap-2 py-4 text-center">
          <div
            className="bg-secondary text-secondary-foreground flex size-12 items-center justify-center rounded-lg"
            aria-hidden
          >
            {createElement(getCategoryIcon(iconName), { className: "size-6" })}
          </div>
          <h3 className="text-h3">{name}</h3>
          <p className="text-small">{adsLabel}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export { CategoryCard };
export type { CategoryCardProps };
