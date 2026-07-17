import { cn } from "@/lib/utils";

type PlanUsageProgressProps = {
  used: number;
  limit: number;
  className?: string;
  /** Exibe rótulo "18 / 50 anúncios · 36%". */
  showLabel?: boolean;
};

/**
 * Barra de progresso do uso do plano (anúncios publicados / limite).
 */
function PlanUsageProgress({
  used,
  limit,
  className,
  showLabel = true,
}: PlanUsageProgressProps) {
  const safeLimit = Math.max(0, limit);
  const safeUsed = Math.max(0, used);
  const percent =
    safeLimit === 0 ? 100 : Math.min(100, Math.round((safeUsed / safeLimit) * 100));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showLabel ? (
        <div className="text-small text-muted-foreground flex items-center justify-between gap-2">
          <span>
            {safeUsed} / {safeLimit} anúncios
          </span>
          <span className="tabular-nums">{percent}%</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Uso do plano: ${safeUsed} de ${safeLimit} anúncios`}
        className="bg-muted h-2 w-full overflow-hidden rounded-full"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300",
            percent >= 100
              ? "bg-destructive"
              : percent >= 80
                ? "bg-amber-500"
                : "bg-primary",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export { PlanUsageProgress };
export type { PlanUsageProgressProps };
