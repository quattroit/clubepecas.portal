import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type PageLoaderProps = {
  label?: string;
  className?: string;
};

/**
 * Loader de página inteira — ocupa a área de conteúdo.
 */
function PageLoader({
  label = "Carregando página…",
  className,
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <Loader2 className="text-primary size-8 animate-spin" aria-hidden />
      <p className="text-small">{label}</p>
    </div>
  );
}

export { PageLoader };
export type { PageLoaderProps };
