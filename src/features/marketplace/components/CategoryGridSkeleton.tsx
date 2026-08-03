import { Skeleton } from "@/components/ui/skeleton";

type CategoryGridSkeletonProps = {
  count?: number;
};

function CategoryGridSkeleton({ count = 8 }: CategoryGridSkeletonProps) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4"
      aria-busy="true"
      aria-label="Carregando categorias"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-2 rounded-2xl border p-3"
        >
          <Skeleton className="size-12 rounded-lg" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export { CategoryGridSkeleton };
export type { CategoryGridSkeletonProps };
