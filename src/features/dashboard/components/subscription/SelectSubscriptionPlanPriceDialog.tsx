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
import { AvailablePlanPicker } from "@/features/dashboard/components/subscription/AvailablePlanPicker";

type SelectSubscriptionPlanPriceAction =
  | "upgrade"
  | "downgrade"
  | "change-cycle";

type SelectSubscriptionPlanPriceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  action: SelectSubscriptionPlanPriceAction;
  plans: SubscriptionAvailablePlanDto[];
  /** Quando definido, oculta o ciclo atual do plano corrente (troca de ciclo). */
  excludeBillingCycle?: BillingCycle | null;
  loading?: boolean;
  onConfirm: (subscriptionPlanPriceId: number) => void;
};

function SelectSubscriptionPlanPriceDialog({
  open,
  onOpenChange,
  title,
  description,
  action,
  plans,
  excludeBillingCycle = null,
  loading = false,
  onConfirm,
}: SelectSubscriptionPlanPriceDialogProps) {
  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && loading) return;
    onOpenChange(nextOpen);
  }

  const handlePrice = (subscriptionPlanPriceId: number) => {
    onConfirm(subscriptionPlanPriceId);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <AvailablePlanPicker
          plans={plans}
          currentBillingCycle={excludeBillingCycle}
          selectionLoading={loading}
          emptyMessage="Nenhum plano disponível para esta ação no momento."
          className="grid gap-3 sm:grid-cols-2"
          onUpgradePrice={action === "upgrade" ? handlePrice : undefined}
          onDowngradePrice={action === "downgrade" ? handlePrice : undefined}
          onChangeCyclePrice={
            action === "change-cycle" ? handlePrice : undefined
          }
        />
      </DialogContent>
    </Dialog>
  );
}

export { SelectSubscriptionPlanPriceDialog };
export type {
  SelectSubscriptionPlanPriceAction,
  SelectSubscriptionPlanPriceDialogProps,
};
