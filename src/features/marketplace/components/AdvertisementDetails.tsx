import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Advertisement } from "@/types/Advertisement";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatVehicleYears } from "@/utils/vehicle-years";
import { cn } from "@/lib/utils";

type AdvertisementDetailsProps = {
  advertisement: Advertisement;
  className?: string;
};

function formatPublishedAt(value?: string) {
  if (!value) return null;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

/**
 * Bloco de informações do anúncio — apenas apresentação.
 */
function AdvertisementDetails({
  advertisement,
  className,
}: AdvertisementDetailsProps) {
  const {
    title,
    price,
    stockQuantity,
    manufacturingYear,
    modelYear,
    isNew,
    category,
    city,
    state,
    description,
    publishedAt,
  } = advertisement;

  const publishedLabel = formatPublishedAt(publishedAt);
  const vehicleYearsLabel =
    typeof manufacturingYear === "number" && typeof modelYear === "number"
      ? formatVehicleYears(manufacturingYear, modelYear)
      : null;

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-small text-category font-medium">{category}</p>
        {isNew ? <Badge variant="success">Novo</Badge> : (
          <Badge variant="secondary">Usado</Badge>
        )}
      </div>

      <h1 className="text-h1">{title}</h1>

      <p className="text-price-lg">{formatCurrency(price)}</p>

      <dl className="text-small grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground mb-0.5">Localização</dt>
          <dd className="text-foreground flex items-center gap-1.5 font-medium">
            <MapPin className="text-location size-3.5 shrink-0" aria-hidden />
            {city}, {state}
          </dd>
        </div>
        {vehicleYearsLabel ? (
          <div>
            <dt className="text-muted-foreground mb-0.5">Ano</dt>
            <dd className="text-foreground font-medium">{vehicleYearsLabel}</dd>
          </div>
        ) : null}
        {typeof stockQuantity === "number" ? (
          <div>
            <dt className="text-muted-foreground mb-0.5">Estoque</dt>
            <dd className="text-foreground font-medium">
              {stockQuantity} {stockQuantity === 1 ? "unidade" : "unidades"}
            </dd>
          </div>
        ) : null}
        {publishedLabel ? (
          <div>
            <dt className="text-muted-foreground mb-0.5">Publicado em</dt>
            <dd className="text-foreground font-medium">{publishedLabel}</dd>
          </div>
        ) : null}
      </dl>

      <Separator />

      <div className="flex flex-col gap-2.5">
        <h2 className="text-h3">Descrição</h2>
        <p className="text-body whitespace-pre-line">
          {description ?? "Sem descrição disponível."}
        </p>
      </div>
    </div>
  );
}

export { AdvertisementDetails };
export type { AdvertisementDetailsProps };
