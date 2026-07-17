import Link from "next/link";
import { MapPin, Package } from "lucide-react";

import { RemoteImage } from "@/components/media/RemoteImage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { advertisementPath } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Advertisement } from "@/types/Advertisement";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatVehicleYears } from "@/utils/vehicle-years";

type AdvertisementCardProps = {
  advertisement: Advertisement;
  className?: string;
};

function AdvertisementCard({
  advertisement,
  className,
}: AdvertisementCardProps) {
  const {
    id,
    slug,
    title,
    price,
    stockQuantity,
    manufacturingYear,
    modelYear,
    city,
    state,
    category,
    imageUrl,
    isNew,
  } = advertisement;
  const location = `${city}, ${state}`;
  const href = advertisementPath(slug ?? id);
  const vehicleYearsLabel =
    typeof manufacturingYear === "number" && typeof modelYear === "number"
      ? formatVehicleYears(manufacturingYear, modelYear)
      : null;

  return (
    <Link
      href={href}
      className={cn(
        "focus-visible:ring-ring block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
      )}
    >
      <Card size="sm" className="card-interactive h-full gap-0 rounded-2xl py-0">
        <div className="bg-muted relative aspect-[16/10] overflow-hidden">
          {imageUrl ? (
            <RemoteImage
              src={imageUrl}
              alt={`Foto do anúncio: ${title}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover/card:scale-[1.03]"
            />
          ) : (
            <div
              className="text-muted-foreground flex size-full items-center justify-center"
              role="img"
              aria-label={`Sem foto para o anúncio: ${title}`}
            >
              <Package className="size-8" aria-hidden />
            </div>
          )}

          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {isNew ? (
              <Badge variant="success">Novo</Badge>
            ) : (
              <Badge variant="secondary">Usado</Badge>
            )}
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col gap-1 py-2.5">
          <p className="text-small text-category truncate text-xs font-medium">
            {category}
          </p>
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold">
            {title}
          </h3>
          <p className="text-price text-base">{formatCurrency(price)}</p>
          {vehicleYearsLabel ? (
            <p className="text-muted-foreground text-xs">
              Ano: {vehicleYearsLabel}
            </p>
          ) : null}
          {typeof stockQuantity === "number" ? (
            <p className="text-muted-foreground text-xs">
              Estoque: {stockQuantity}{" "}
              {stockQuantity === 1 ? "unidade" : "unidades"}
            </p>
          ) : null}
          <p className="text-small mt-auto flex items-center gap-1">
            <MapPin className="text-location size-3 shrink-0" aria-hidden />
            <span className="truncate text-xs">{location}</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export { AdvertisementCard };
export type { AdvertisementCardProps };
