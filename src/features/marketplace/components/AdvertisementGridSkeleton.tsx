import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton do grid público — mesmo layout do AdvertisementGrid. */
function AdvertisementGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-busy="true"
      aria-label="Carregando anúncios"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-card overflow-hidden rounded-2xl shadow-xs ring-1 ring-foreground/10"
        >
          <Skeleton className="aspect-[16/10] w-full rounded-none" />
          <div className="flex flex-col gap-1.5 p-2.5">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { AdvertisementGridSkeleton };
