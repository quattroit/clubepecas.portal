import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { advertisementPath } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Advertisement } from "@/types/Advertisement";
import { formatCurrency } from "@/utils/formatCurrency";

type AdvertisementCardProps = {
  advertisement: Advertisement;
  className?: string;
};

function AdvertisementCard({
  advertisement,
  className,
}: AdvertisementCardProps) {
  const { id, slug, title, price, city, state, category, imageUrl, isNew } =
    advertisement;
  const location = `${city}, ${state}`;
  const href = advertisementPath(slug ?? id);

  return (
    <Link
      href={href}
      className={cn(
        "focus-visible:ring-ring block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
      )}
    >
      <Card
        size="sm"
        className="h-full gap-0 py-0 shadow-xs transition-shadow hover:shadow-sm"
      >
        <div className="bg-muted relative aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Foto do anúncio: ${title}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div
              className="text-muted-foreground flex size-full items-center justify-center"
              role="img"
              aria-label={`Sem foto para o anúncio: ${title}`}
            >
              <Package className="size-10" aria-hidden />
            </div>
          )}

          {isNew ? (
            <Badge className="absolute top-2 left-2" variant="success">
              Novo
            </Badge>
          ) : null}
        </div>

        <CardContent className="flex flex-1 flex-col gap-1.5 py-3">
          <p className="text-small text-muted-foreground truncate">
            {category}
          </p>
          <h3 className="text-h3 line-clamp-2 min-h-[2.7rem] leading-snug">
            {title}
          </h3>
          <p className="text-primary text-base font-semibold">
            {formatCurrency(price)}
          </p>
          <p className="text-small mt-auto">{location}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export { AdvertisementCard };
export type { AdvertisementCardProps };
