import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type AdminSettingsFormSkeletonProps = {
  className?: string;
};

/**
 * Skeleton do formulário de configurações — evita layout shift.
 */
function AdminSettingsFormSkeleton({
  className,
}: AdminSettingsFormSkeletonProps) {
  return (
    <div
      data-slot="admin-settings-form-skeleton"
      aria-busy
      aria-label="Carregando configurações"
      className={cn("flex flex-col gap-6", className)}
    >
      {Array.from({ length: 4 }).map((_, sectionIndex) => (
        <div
          key={sectionIndex}
          className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-xs"
        >
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-72 max-w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((__, fieldIndex) => (
              <div key={fieldIndex} className="flex flex-col gap-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>
    </div>
  );
}

export { AdminSettingsFormSkeleton };
export type { AdminSettingsFormSkeletonProps };
