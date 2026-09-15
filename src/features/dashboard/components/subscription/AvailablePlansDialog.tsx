"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BillingCycle } from "@/contracts/common/enums";
import type { SubscriptionAvailablePlanDto } from "@/contracts/seller/subscription";
import {
  AvailablePlanPicker,
  type AvailablePlanPriceHandler,
} from "@/features/dashboard/components/subscription/AvailablePlanPicker";

type AvailablePlansDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plans: SubscriptionAvailablePlanDto[];
  currentBillingCycle?: BillingCycle | null;
  loading?: boolean;
  onUpgradePrice?: AvailablePlanPriceHandler;
  onDowngradePrice?: AvailablePlanPriceHandler;
  onChangeCyclePrice?: AvailablePlanPriceHandler;
};

function AvailablePlansDialog({
  open,
  onOpenChange,
  plans,
  currentBillingCycle = null,
  loading = false,
  onUpgradePrice,
  onDowngradePrice,
  onChangeCyclePrice,
}: AvailablePlansDialogProps) {
  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && loading) return;
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Planos disponíveis</DialogTitle>
          <DialogDescription>
            No upgrade, você paga só a diferença proporcional aos dias
            restantes. A próxima cobrança recorrente já sai no valor cheio do
            novo plano.
          </DialogDescription>
        </DialogHeader>

        <AvailablePlanPicker
          plans={plans}
          currentBillingCycle={currentBillingCycle}
          selectionLoading={loading}
          emptyMessage="Nenhum plano disponível no momento."
          className="grid gap-3 sm:grid-cols-2"
          onUpgradePrice={onUpgradePrice}
          onDowngradePrice={onDowngradePrice}
          onChangeCyclePrice={onChangeCyclePrice}
        />
      </DialogContent>
    </Dialog>
  );
}

export { AvailablePlansDialog };
export type { AvailablePlansDialogProps };
