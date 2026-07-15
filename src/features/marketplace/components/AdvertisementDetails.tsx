import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Advertisement } from "@/types/Advertisement";
import { formatCurrency } from "@/utils/formatCurrency";
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
    isNew,
    category,
    city,
    state,
    description,
    publishedAt,
  } = advertisement;

  const publishedLabel = formatPublishedAt(publishedAt);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-small text-muted-foreground">{category}</p>
        {isNew ? <Badge variant="success">Novo</Badge> : null}
      </div>

      <h1 className="text-h1">{title}</h1>

      <p className="text-primary text-2xl font-semibold">
        {formatCurrency(price)}
      </p>

      <dl className="text-small grid gap-2 sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Localização</dt>
          <dd className="font-medium">
            {city}, {state}
          </dd>
        </div>
        {publishedLabel ? (
          <div>
            <dt className="text-muted-foreground">Publicado em</dt>
            <dd className="font-medium">{publishedLabel}</dd>
          </div>
        ) : null}
      </dl>

      <Separator />

      <div className="flex flex-col gap-2">
        <h2 className="text-h3">Descrição</h2>
        <p className="text-body text-muted-foreground whitespace-pre-line">
          {description ?? "Sem descrição disponível."}
        </p>
      </div>
    </div>
  );
}

export { AdvertisementDetails };
export type { AdvertisementDetailsProps };
