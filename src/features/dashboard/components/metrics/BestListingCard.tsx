import Image from "next/image";
import Link from "next/link";
import { Package, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { editAdvertisementPath } from "@/constants/routes";
import type { ListingMetricItemDto } from "@/contracts/seller/metrics";
import {
  formatConversionRate,
  formatMetricCount,
} from "@/utils/formatMetrics";
import { cn } from "@/lib/utils";

type BestListingCardProps = {
  listing: ListingMetricItemDto;
  className?: string;
};

/**
 * Destaque do anúncio com melhor desempenho (mais visualizações).
 */
function BestListingCard({ listing, className }: BestListingCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <div className="bg-muted relative aspect-[5/3] w-full shrink-0 overflow-hidden rounded-xl sm:aspect-square sm:size-28">
          {listing.thumbnailUrl ? (
            <Image
              src={listing.thumbnailUrl}
              alt={`Foto de ${listing.title}`}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex size-full items-center justify-center">
              <Package className="size-8" aria-hidden />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Trophy className="size-3" aria-hidden />
              Melhor anúncio
            </Badge>
          </div>

          <Link
            href={editAdvertisementPath(listing.id)}
            className="text-h3 hover:text-primary focus-visible:ring-ring block truncate rounded-sm outline-none focus-visible:ring-2"
          >
            {listing.title}
          </Link>

          <dl className="grid grid-cols-3 gap-3">
            <div>
              <dt className="text-muted-foreground text-xs">Visualizações</dt>
              <dd className="text-price text-base tabular-nums">
                {formatMetricCount(listing.views)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">WhatsApp</dt>
              <dd className="text-price text-base tabular-nums">
                {formatMetricCount(listing.whatsappClicks)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Conversão</dt>
              <dd className="text-price text-base tabular-nums">
                {formatConversionRate(listing.conversionRate)}
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}

export { BestListingCard };
export type { BestListingCardProps };
