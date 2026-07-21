"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SubscriptionAvailablePlanDto } from "@/contracts/seller/subscription";
import { PlanDescription } from "@/features/plans/components/PlanDescription";
import {
  formatPlanAdvertisementLimit,
  formatPlanPrice,
} from "@/features/plans/utils/plan-display";

type AvailablePlansCardProps = {
  plans: SubscriptionAvailablePlanDto[];
};

function AvailablePlansCard({ plans }: AvailablePlansCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Planos disponíveis</CardTitle>
        <CardDescription>
          Comparação preparatória (Sprint 8.5). Economia e classificação vêm da
          API — nenhuma alteração é executada nesta tela.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.length === 0 ? (
          <p className="text-small text-muted-foreground sm:col-span-2 lg:col-span-3">
            Nenhum plano ativo disponível no momento.
          </p>
        ) : (
          plans.map((plan) => {
            const recommended = plan.billingCycles.find(
              (cycle) => cycle.isRecommended,
            );
            const showcase = recommended ?? plan.billingCycles[0];

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
                      {formatPlanPrice(showcase.price, showcase.billingCycle)}
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
              </article>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

export { AvailablePlansCard };
export type { AvailablePlansCardProps };
