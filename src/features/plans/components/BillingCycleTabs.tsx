import type { BillingCycle } from "@/contracts/common/enums";
import type { SubscriptionPlanPriceDto } from "@/contracts/seller/subscription";
import { sortPlanPrices } from "@/features/plans/utils/plan-display";
import { cn } from "@/lib/utils";

type BillingCycleTabsProps = {
  prices: readonly SubscriptionPlanPriceDto[];
  selectedCycle: BillingCycle;
  onSelect: (cycle: BillingCycle) => void;
  className?: string;
  "aria-label"?: string;
};

/**
 * Seletor de ciclo de cobrança (Mensal/Trimestral/Anual). Os rótulos vêm de
 * `billingCycleLabel` — nunca são fixados no cliente.
 */
function BillingCycleTabs({
  prices,
  selectedCycle,
  onSelect,
  className,
  "aria-label": ariaLabel = "Selecione o ciclo de cobrança",
}: BillingCycleTabsProps) {
  const sorted = sortPlanPrices(prices);

  if (sorted.length <= 1) {
    return null;
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "bg-muted inline-flex w-full items-center gap-1 rounded-lg p-1",
        className,
      )}
    >
      {sorted.map((price) => {
        const isSelected = price.billingCycle === selectedCycle;

        return (
          <button
            key={price.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(price.billingCycle)}
            className={cn(
              "relative flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
              isSelected
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {price.billingCycleLabel}
          </button>
        );
      })}
    </div>
  );
}

export { BillingCycleTabs };
export type { BillingCycleTabsProps };
