import Link from "next/link";

import { editAdvertisementPath } from "@/constants/routes";
import type { ListingMetricItemDto } from "@/contracts/seller/metrics";
import {
  formatConversionRate,
  formatMetricCount,
} from "@/utils/formatMetrics";
import { cn } from "@/lib/utils";

type TopListingsTableProps = {
  listings: ListingMetricItemDto[];
  className?: string;
};

/**
 * Ranking dos anúncios mais visualizados.
 */
function TopListingsTable({ listings, className }: TopListingsTableProps) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "border-border bg-card overflow-hidden rounded-xl border shadow-xs",
        className,
      )}
    >
      {/* Mobile: lista empilhada */}
      <ul className="divide-border divide-y sm:hidden" aria-label="Ranking de anúncios">
        {listings.map((listing, index) => (
          <li key={listing.id} className="flex flex-col gap-2 p-4">
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground w-5 shrink-0 text-sm tabular-nums">
                {index + 1}.
              </span>
              <Link
                href={editAdvertisementPath(listing.id)}
                className="text-foreground hover:text-primary focus-visible:ring-ring min-w-0 flex-1 truncate text-sm font-medium outline-none focus-visible:ring-2"
              >
                {listing.title}
              </Link>
            </div>
            <dl className="text-muted-foreground grid grid-cols-3 gap-2 pl-7 text-xs">
              <div>
                <dt className="sr-only">Visualizações</dt>
                <dd>
                  <span className="text-foreground font-medium tabular-nums">
                    {formatMetricCount(listing.views)}
                  </span>{" "}
                  views
                </dd>
              </div>
              <div>
                <dt className="sr-only">Cliques WhatsApp</dt>
                <dd>
                  <span className="text-foreground font-medium tabular-nums">
                    {formatMetricCount(listing.whatsappClicks)}
                  </span>{" "}
                  WA
                </dd>
              </div>
              <div>
                <dt className="sr-only">Conversão</dt>
                <dd className="text-foreground font-medium tabular-nums">
                  {formatConversionRate(listing.conversionRate)}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {/* Desktop / tablet: tabela */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <caption className="sr-only">
            Top 10 anúncios por visualizações
          </caption>
          <thead className="bg-muted/50 border-border border-b">
            <tr>
              <th scope="col" className="text-muted-foreground px-4 py-3 font-medium">
                #
              </th>
              <th scope="col" className="text-muted-foreground px-4 py-3 font-medium">
                Anúncio
              </th>
              <th
                scope="col"
                className="text-muted-foreground px-4 py-3 text-right font-medium"
              >
                Visualizações
              </th>
              <th
                scope="col"
                className="text-muted-foreground px-4 py-3 text-right font-medium"
              >
                WhatsApp
              </th>
              <th
                scope="col"
                className="text-muted-foreground px-4 py-3 text-right font-medium"
              >
                Conversão
              </th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {listings.map((listing, index) => (
              <tr key={listing.id} className="hover:bg-muted/30">
                <td className="text-muted-foreground px-4 py-3 tabular-nums">
                  {index + 1}
                </td>
                <td className="max-w-[16rem] px-4 py-3">
                  <Link
                    href={editAdvertisementPath(listing.id)}
                    className="text-foreground hover:text-primary focus-visible:ring-ring truncate font-medium outline-none focus-visible:ring-2"
                  >
                    {listing.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatMetricCount(listing.views)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatMetricCount(listing.whatsappClicks)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatConversionRate(listing.conversionRate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { TopListingsTable };
export type { TopListingsTableProps };
