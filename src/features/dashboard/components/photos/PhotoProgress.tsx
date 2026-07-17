"use client";

import { cn } from "@/lib/utils";

type PhotoProgressProps = {
  progress: number;
  statusLabel: string;
  className?: string;
};

function PhotoProgress({
  progress,
  statusLabel,
  className,
}: PhotoProgressProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground text-[11px] font-medium">
          {statusLabel}
        </span>
        <span className="text-muted-foreground text-[11px] tabular-nums">
          {clamped}%
        </span>
      </div>
      <div
        className="bg-muted h-1.5 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label={statusLabel}
      >
        <div
          className="bg-primary h-full rounded-full transition-[width] duration-200 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export { PhotoProgress };
