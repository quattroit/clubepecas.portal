"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SubscriptionPlanCatalogItemDto } from "@/contracts/seller/subscription";
import { PlanDescription } from "@/features/plans/components/PlanDescription";
import {
  formatPlanAdvertisementLimit,
  formatPlanPrice,
} from "@/features/plans/utils/plan-display";

type AvailablePlansCardProps = {
  plans: SubscriptionPlanCatalogItemDto[];
  currentPlanId?: number | null;
  onSelectPlan: () => void;
};

function AvailablePlansCard({
  plans,
  currentPlanId,
  onSelectPlan,
}: AvailablePlansCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Planos disponíveis</CardTitle>
        <CardDescription>
          Compare opções e selecione um plano pelo fluxo de contratação.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.length === 0 ? (
          <p className="text-small text-muted-foreground sm:col-span-2 lg:col-span-3">
            Nenhum plano ativo disponível no momento.
          </p>
        ) : (
          plans.map((plan) => {
            const isCurrent = currentPlanId === plan.id;

            return (
              <article
                key={plan.id}
                className="border-border flex flex-col gap-3 rounded-xl border px-4 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold">{plan.name}</h3>
                  {isCurrent ? (
                    <Badge variant="success">Plano Atual</Badge>
                  ) : null}
                </div>
                <p className="text-primary text-sm font-semibold">
                  {formatPlanPrice(plan.price)}
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
                {!isCurrent ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-auto w-full"
                    onClick={onSelectPlan}
                  >
                    Selecionar
                  </Button>
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
