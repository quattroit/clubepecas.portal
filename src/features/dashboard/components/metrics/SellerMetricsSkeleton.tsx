import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton da seção de métricas — evita layout shift.
 */
function SellerMetricsSkeleton() {
  return (
    <div
      className="flex flex-col gap-5"
      aria-busy="true"
      aria-label="Carregando métricas"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-9 w-full sm:w-72" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-card space-y-3 rounded-xl border p-4 shadow-xs"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-20" />
          </div>
        ))}
      </div>

      <Skeleton className="h-36 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}

export { SellerMetricsSkeleton };
