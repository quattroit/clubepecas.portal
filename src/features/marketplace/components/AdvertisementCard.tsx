import Link from "next/link";
import { MapPin, Package, Store, Truck } from "lucide-react";

import { RemoteImage } from "@/components/media/RemoteImage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { advertisementPath } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Advertisement } from "@/types/Advertisement";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatLocalDeliveryOfferLabel } from "@/utils/localDelivery";
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
    storeName,
    offersLocalDelivery,
    localDeliveryMaxRadiusKm,
  } = advertisement;
  const location = `${city}, ${state}`;
  const href = advertisementPath(slug ?? String(id));
  const vehicleYearsLabel =
    typeof manufacturingYear === "number" && typeof modelYear === "number"
      ? formatVehicleYears(manufacturingYear, modelYear)
      : null;
  const localDeliveryLabel = formatLocalDeliveryOfferLabel(
    localDeliveryMaxRadiusKm,
  );

  return (
    <Link
      href={href}
      className={cn(
        "focus-visible:ring-ring flex h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
      )}
    >
      <Card
        size="sm"
        className="card-interactive flex h-full w-full flex-1 flex-col gap-0 rounded-2xl py-0"
      >
        <div className="bg-muted relative aspect-[16/10] overflow-hidden">
          {imageUrl ? (
            <RemoteImage
              src={imageUrl}
              alt={`Foto do anúncio: ${title}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover/card:scale-[1.03]"
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

          {offersLocalDelivery ? (
            <div className="absolute top-2 right-2">
              <Badge
                variant="outline"
                className="border-primary/25 bg-primary/90 text-primary-foreground shadow-sm backdrop-blur-sm"
                title={localDeliveryLabel}
              >
                <Truck data-icon="inline-start" aria-hidden />
                Frete Local
              </Badge>
            </div>
          ) : null}
        </div>

        <CardContent className="flex flex-1 flex-col gap-1 py-2.5">
          <p className="text-small text-category truncate text-xs font-medium">
            {category}
          </p>
          <p
            className={cn(
              "text-muted-foreground flex min-h-[1.125rem] items-center gap-1 text-xs",
              !storeName?.trim() && "invisible",
            )}
            aria-hidden={!storeName?.trim()}
          >
            <Store className="size-3 shrink-0 opacity-70" aria-hidden />
            <span className="truncate">{storeName?.trim() || "\u00A0"}</span>
          </p>
          <h3 className="line-clamp-2 min-h-10 text-sm leading-snug font-semibold">
            {title}
          </h3>
          <p className="text-price text-base">{formatCurrency(price)}</p>

          <div className="text-muted-foreground min-h-10 space-y-0.5 text-xs">
            <p aria-hidden={!vehicleYearsLabel}>
              {vehicleYearsLabel ? `Ano: ${vehicleYearsLabel}` : "\u00A0"}
            </p>
            <p aria-hidden={typeof stockQuantity !== "number"}>
              {typeof stockQuantity === "number"
                ? `Estoque: ${stockQuantity} ${
                    stockQuantity === 1 ? "unidade" : "unidades"
                  }`
                : "\u00A0"}
            </p>
          </div>

          <div className="mt-auto space-y-1">
            <p className="text-small flex items-center gap-1">
              <MapPin className="text-location size-3 shrink-0" aria-hidden />
              <span className="truncate text-xs">{location}</span>
            </p>
            <p
              className={cn(
                "text-primary flex min-h-[1.125rem] items-center gap-1 text-xs font-medium",
                !offersLocalDelivery && "invisible",
              )}
              aria-hidden={!offersLocalDelivery}
            >
              <Truck className="size-3.5 shrink-0" aria-hidden />
              {localDeliveryLabel}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export { AdvertisementCard };
export type { AdvertisementCardProps };
