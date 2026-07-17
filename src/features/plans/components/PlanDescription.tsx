import { parsePlanDescription } from "@/features/plans/utils/parse-plan-description";
import { cn } from "@/lib/utils";

type PlanDescriptionProps = {
  description: string;
  className?: string;
  /** Estilo mais compacto (modal do painel). */
  compact?: boolean;
};

/**
 * Renderiza a descrição do plano com parágrafos e lista de benefícios (✓).
 */
function PlanDescription({
  description,
  className,
  compact = false,
}: PlanDescriptionProps) {
  const blocks = parsePlanDescription(description);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col",
        compact ? "gap-2" : "gap-3",
        className,
      )}
    >
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p
              key={`p-${index}`}
              className={cn(
                compact
                  ? "text-small text-muted-foreground"
                  : "text-body text-foreground",
              )}
            >
              {block.text}
            </p>
          );
        }

        return (
          <ul
            key={`ul-${index}`}
            className={cn(
              "list-none space-y-1.5 pl-0",
              compact
                ? "text-small text-muted-foreground"
                : "text-body text-foreground",
            )}
          >
            {block.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span
                  className="text-primary mt-0.5 shrink-0 font-semibold"
                  aria-hidden
                >
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

export { PlanDescription };
export type { PlanDescriptionProps };
