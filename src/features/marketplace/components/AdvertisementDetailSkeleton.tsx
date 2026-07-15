import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton do detalhe público — espelha o layout existente. */
function AdvertisementDetailSkeleton() {
  return (
    <div
      className="flex flex-col gap-8 md:gap-10"
      aria-busy="true"
      aria-label="Carregando anúncio"
    >
      <Skeleton className="h-4 w-48" />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-4/5" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export { AdvertisementDetailSkeleton };
