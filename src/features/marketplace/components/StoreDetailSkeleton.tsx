import { Skeleton } from "@/components/ui/skeleton";
import { AdvertisementGridSkeleton } from "@/features/marketplace/components/AdvertisementGridSkeleton";

function StoreDetailSkeleton() {
  return (
    <div
      className="flex flex-col gap-8 md:gap-10"
      aria-busy="true"
      aria-label="Carregando loja"
    >
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-16 w-full" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-7 w-48" />
      <AdvertisementGridSkeleton />
    </div>
  );
}

export { StoreDetailSkeleton };
