import { Skeleton } from "@/components/ui/skeleton";

function MyAdvertisementsSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
      aria-busy="true"
      aria-label="Carregando anúncios"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-card overflow-hidden rounded-xl shadow-xs ring-1 ring-foreground/10"
        >
          <Skeleton className="aspect-[5/3] w-full rounded-none" />
          <div className="flex flex-col gap-1 px-2.5 py-2">
            <Skeleton className="h-2.5 w-1/3" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-2.5 w-2/3" />
            <div className="mt-1 flex gap-1.5">
              <Skeleton className="h-7 flex-1" />
              <Skeleton className="h-7 flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { MyAdvertisementsSkeleton };
