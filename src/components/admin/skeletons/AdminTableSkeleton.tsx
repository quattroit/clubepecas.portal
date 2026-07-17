import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type AdminCardSkeletonProps = {
  className?: string;
  lines?: number;
};

function AdminCardSkeleton({ className, lines = 3 }: AdminCardSkeletonProps) {
  return (
    <div
      data-slot="admin-card-skeleton"
      aria-busy
      aria-label="Carregando"
      className={cn(
        "border-border bg-card flex flex-col gap-3 rounded-2xl border p-4 shadow-xs",
        className,
      )}
    >
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-3", index === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

type AdminMetricCardSkeletonProps = {
  className?: string;
};

function AdminMetricCardSkeleton({ className }: AdminMetricCardSkeletonProps) {
  return (
    <div
      data-slot="admin-metric-card-skeleton"
      aria-busy
      className={cn(
        "border-border bg-card flex flex-col gap-3 rounded-2xl border p-4 shadow-xs",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-9 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

type AdminHeaderSkeletonProps = {
  className?: string;
};

function AdminHeaderSkeleton({ className }: AdminHeaderSkeletonProps) {
  return (
    <div
      data-slot="admin-header-skeleton"
      aria-busy
      className={cn("flex flex-col gap-3", className)}
    >
      <Skeleton className="h-3 w-40" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <Skeleton className="h-9 w-28 shrink-0" />
      </div>
    </div>
  );
}

type AdminTableSkeletonProps = {
  columns?: number;
  rows?: number;
  className?: string;
};

function AdminTableSkeleton({
  columns = 4,
  rows = 5,
  className,
}: AdminTableSkeletonProps) {
  return (
    <div
      data-slot="admin-table-skeleton"
      aria-busy
      aria-label="Carregando tabela"
      className={cn(
        "border-border bg-card overflow-hidden rounded-xl border shadow-xs",
        className,
      )}
    >
      <div className="bg-muted/40 border-border flex gap-4 border-b px-4 py-3">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-3 flex-1" />
        ))}
      </div>
      <div className="divide-border divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 px-4 py-3">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type AdminListSkeletonProps = {
  items?: number;
  className?: string;
};

function AdminListSkeleton({ items = 4, className }: AdminListSkeletonProps) {
  return (
    <div
      data-slot="admin-list-skeleton"
      aria-busy
      aria-label="Carregando listagem"
      className={cn("flex flex-col gap-3", className)}
    >
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="border-border bg-card flex items-center gap-3 rounded-xl border p-4 shadow-xs"
        >
          <Skeleton className="size-10 shrink-0 rounded-lg" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-8 w-20 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export {
  AdminCardSkeleton,
  AdminMetricCardSkeleton,
  AdminHeaderSkeleton,
  AdminTableSkeleton,
  AdminListSkeleton,
};
export type {
  AdminCardSkeletonProps,
  AdminMetricCardSkeletonProps,
  AdminHeaderSkeletonProps,
  AdminTableSkeletonProps,
  AdminListSkeletonProps,
};
