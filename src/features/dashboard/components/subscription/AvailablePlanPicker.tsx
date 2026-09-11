"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BillingCycle } from "@/contracts/common/enums";
import type {
  SubscriptionAvailablePlanCycleDto,
  SubscriptionAvailablePlanDto,
} from "@/contracts/seller/subscription";
import { PlanDescription } from "@/features/plans/components/PlanDescription";
import {
  formatPlanAdvertisementLimit,
  formatPlanPrice,
} from "@/features/plans/utils/plan-display";
import { cn } from "@/lib/utils";

type AvailablePlanPriceHandler = (
  subscriptionPlanPriceId: number,
  plan: SubscriptionAvailablePlanDto,
  cycle: SubscriptionAvailablePlanCycleDto,
) => void;

type AvailablePlanPickerProps = {
  plans: SubscriptionAvailablePlanDto[];
  currentBillingCycle?: BillingCycle | null;
  selectionLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  emptyClassName?: string;
  onUpgradePrice?: AvailablePlanPriceHandler;
  onDowngradePrice?: AvailablePlanPriceHandler;
  onChangeCyclePrice?: AvailablePlanPriceHandler;
};

function AvailablePlanPicker({
  plans,
  currentBillingCycle = null,
  selectionLoading = false,
  emptyMessage = "Nenhum plano ativo disponível no momento.",
  className,
  emptyClassName,
  onUpgradePrice,
  onDowngradePrice,
  onChangeCyclePrice,
}: AvailablePlanPickerProps) {
  if (plans.length === 0) {
    return (
      <p className={cn("text-small text-muted-foreground", emptyClassName)}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className={className}>
      {plans.map((plan) => {
        const showUpgrade =
          Boolean(onUpgradePrice) && plan.isUpgrade && plan.isAvailable;
        const showDowngrade =
          Boolean(onDowngradePrice) && plan.isDowngrade && plan.isAvailable;
        const showChangeCycle =
          Boolean(onChangeCyclePrice) && plan.isCurrent;
        const actionCycles = showChangeCycle
          ? plan.billingCycles.filter(
              (cycle) =>
                currentBillingCycle == null ||
                cycle.billingCycle !== currentBillingCycle,
            )
          : showUpgrade || showDowngrade
            ? plan.billingCycles
            : [];
        const showcase = plan.billingCycles[0];

        return (
          <article
            key={plan.id}
            className="border-border flex flex-col gap-3 rounded-xl border px-4 py-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-sm font-semibold">{plan.name}</h3>
              <div className="flex flex-wrap gap-1">
                {plan.isCurrent ? (
                  <Badge variant="success">Atual</Badge>
                ) : null}
                {plan.isUpgrade ? (
                  <Badge variant="outline">Upgrade</Badge>
                ) : null}
                {plan.isDowngrade ? (
                  <Badge variant="outline">Downgrade</Badge>
                ) : null}
                {!plan.isAvailable && !plan.isCurrent ? (
                  <Badge variant="secondary">Indisponível</Badge>
                ) : null}
              </div>
            </div>
            {showcase ? (
              <div className="space-y-1">
                <p className="text-primary text-sm font-semibold">
                  {plan.billingCycles.length > 1
                    ? `a partir de ${formatPlanPrice(showcase.price, showcase.billingCycle)}`
                    : formatPlanPrice(showcase.price, showcase.billingCycle)}
                </p>
                {showcase.savingsAmount != null &&
                showcase.savingsAmount > 0 ? (
                  <p className="text-small text-muted-foreground">
                    Economia de {formatPlanPrice(showcase.savingsAmount)}
                    {showcase.savingsPercent != null
                      ? ` (${showcase.savingsPercent}%)`
                      : ""}
                  </p>
                ) : null}
              </div>
            ) : null}
            <p className="text-small text-muted-foreground">
              Ciclos:{" "}
              {plan.billingCycles
                .map((cycle) => cycle.billingCycleLabel)
                .join(" · ")}
            </p>
            <p className="text-small text-muted-foreground">
              {formatPlanAdvertisementLimit(plan.advertisementLimit)}
            </p>
            {plan.description ? (
              <PlanDescription
                description={plan.description}
                compact
                className="line-clamp-6"
              />
            ) : null}

            {actionCycles.length > 0 ? (
              <div className="mt-auto flex flex-col gap-2">
                {actionCycles.map((cycle) => {
                  const label = showChangeCycle
                    ? `Alterar para ${cycle.billingCycleLabel}`
                    : showUpgrade
                      ? `Upgrade — ${cycle.billingCycleLabel}`
                      : `Downgrade — ${cycle.billingCycleLabel}`;
                  const handler = showChangeCycle
                    ? onChangeCyclePrice
                    : showUpgrade
                      ? onUpgradePrice
                      : onDowngradePrice;

                  return (
                    <Button
                      key={cycle.subscriptionPlanPriceId}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-auto min-h-8 whitespace-normal"
                      disabled={selectionLoading || !handler}
                      aria-busy={selectionLoading}
                      onClick={() =>
                        handler?.(
                          cycle.subscriptionPlanPriceId,
                          plan,
                          cycle,
                        )
                      }
                    >
                      {label}
                      {" · "}
                      {formatPlanPrice(cycle.price, cycle.billingCycle)}
                    </Button>
                  );
                })}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export { AvailablePlanPicker };
export type { AvailablePlanPickerProps, AvailablePlanPriceHandler };
