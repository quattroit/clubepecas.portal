import { AdvertisementCard } from "@/features/marketplace/components/AdvertisementCard";
import { cn } from "@/lib/utils";
import type { Advertisement } from "@/types/Advertisement";

type AdvertisementGridProps = {
  advertisements: Advertisement[];
  className?: string;
};

function AdvertisementGrid({
  advertisements,
  className,
}: AdvertisementGridProps) {
  return (
    <ul
      className={cn(
        "grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
      aria-label="Anúncios"
    >
      {advertisements.map((advertisement) => (
        <li key={advertisement.id}>
          <AdvertisementCard advertisement={advertisement} />
        </li>
      ))}
    </ul>
  );
}

export { AdvertisementGrid };
export type { AdvertisementGridProps };
