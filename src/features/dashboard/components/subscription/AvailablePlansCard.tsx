"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BillingCycle } from "@/contracts/common/enums";
import type { SubscriptionAvailablePlanDto } from "@/contracts/seller/subscription";
import {
  AvailablePlanPicker,
  type AvailablePlanPriceHandler,
} from "@/features/dashboard/components/subscription/AvailablePlanPicker";

type AvailablePlansCardProps = {
  plans: SubscriptionAvailablePlanDto[];
  currentBillingCycle?: BillingCycle | null;
  selectionLoading?: boolean;
  onUpgradePrice?: AvailablePlanPriceHandler;
  onDowngradePrice?: AvailablePlanPriceHandler;
  onChangeCyclePrice?: AvailablePlanPriceHandler;
};

function AvailablePlansCard({
  plans,
  currentBillingCycle = null,
  selectionLoading = false,
  onUpgradePrice,
  onDowngradePrice,
  onChangeCyclePrice,
}: AvailablePlansCardProps) {
  const interactive = Boolean(
    onUpgradePrice || onDowngradePrice || onChangeCyclePrice,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Planos disponíveis</CardTitle>
        <CardDescription>
          {interactive
            ? "Selecione um ciclo elegível quando a API permitir a alteração."
            : "Comparação com base nos dados retornados pela API — sem regras de negócio no cliente."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <AvailablePlanPicker
          plans={plans}
          currentBillingCycle={currentBillingCycle}
          selectionLoading={selectionLoading}
          onUpgradePrice={onUpgradePrice}
          onDowngradePrice={onDowngradePrice}
          onChangeCyclePrice={onChangeCyclePrice}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          emptyClassName="sm:col-span-2 lg:col-span-3"
        />
      </CardContent>
    </Card>
  );
}

export { AvailablePlansCard };
export type { AvailablePlansCardProps };
