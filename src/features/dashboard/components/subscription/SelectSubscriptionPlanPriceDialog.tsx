"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BillingCycle } from "@/contracts/common/enums";
import type {
  SubscriptionAvailablePlanCycleDto,
  SubscriptionAvailablePlanDto,
} from "@/contracts/seller/subscription";
import { PlanDescription } from "@/features/plans/components/PlanDescription";
import {
  formatPlanAdvertisementLimit,
  formatPlanPrice,
} from "@/features/plans/utils/plan-display";
import { formatCurrency } from "@/utils/formatCurrency";

type SelectSubscriptionPlanPriceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
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
  confirmLabel,
  plans,
  excludeBillingCycle = null,
  loading = false,
  onConfirm,
}: SelectSubscriptionPlanPriceDialogProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? null,
    [plans, selectedPlanId],
  );

  const cycles = useMemo(() => {
    if (!selectedPlan) return [];
    return selectedPlan.billingCycles.filter(
      (cycle) =>
        excludeBillingCycle == null ||
        cycle.billingCycle !== excludeBillingCycle,
    );
  }, [selectedPlan, excludeBillingCycle]);

  const selectedCycle = useMemo(
    () =>
      cycles.find((cycle) => cycle.subscriptionPlanPriceId === selectedPriceId) ??
      null,
    [cycles, selectedPriceId],
  );

  useEffect(() => {
    if (!open) {
      setSelectedPlanId(null);
      setSelectedPriceId(null);
      return;
    }

    if (plans.length !== 1) return;

    const onlyPlan = plans[0];
    setSelectedPlanId(onlyPlan.id);
    const availableCycles = onlyPlan.billingCycles.filter(
      (cycle) =>
        excludeBillingCycle == null ||
        cycle.billingCycle !== excludeBillingCycle,
    );
    const recommended =
      availableCycles.find((cycle) => cycle.isRecommended) ??
      availableCycles[0];
    setSelectedPriceId(recommended?.subscriptionPlanPriceId ?? null);
  }, [open, plans, excludeBillingCycle]);

  function resetSelection() {
    setSelectedPlanId(null);
    setSelectedPriceId(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && loading) return;
    if (!nextOpen) resetSelection();
    onOpenChange(nextOpen);
  }

  function handlePickPlan(plan: SubscriptionAvailablePlanDto) {
    if (loading) return;
    setSelectedPlanId(plan.id);
    const availableCycles = plan.billingCycles.filter(
      (cycle) =>
        excludeBillingCycle == null ||
        cycle.billingCycle !== excludeBillingCycle,
    );
    const recommended =
      availableCycles.find((cycle) => cycle.isRecommended) ??
      availableCycles[0];
    setSelectedPriceId(recommended?.subscriptionPlanPriceId ?? null);
  }

  function handleConfirm() {
    if (selectedPriceId == null || loading) return;
    onConfirm(selectedPriceId);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {plans.length === 0 ? (
          <p className="text-small text-muted-foreground py-6 text-center">
            Nenhum plano disponível para esta ação no momento.
          </p>
        ) : null}

        {!selectedPlan && plans.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {plans.map((plan) => {
              const showcase =
                plan.billingCycles.find((cycle) => cycle.isRecommended) ??
                plan.billingCycles[0];

              return (
                <li
                  key={plan.id}
                  className="border-border flex flex-col gap-3 rounded-lg border px-4 py-3"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-h3">{plan.name}</h3>
                      {showcase ? (
                        <p className="text-sm font-semibold whitespace-nowrap">
                          {formatPlanPrice(
                            showcase.price,
                            showcase.billingCycle,
                          )}
                        </p>
                      ) : null}
                    </div>
                    {plan.description ? (
                      <PlanDescription
                        description={plan.description}
                        compact
                        className="mt-1"
                      />
                    ) : null}
                    <p className="text-small text-muted-foreground">
                      {formatPlanAdvertisementLimit(plan.advertisementLimit)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    disabled={loading}
                    onClick={() => handlePickPlan(plan)}
                  >
                    Selecionar
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {selectedPlan ? (
          <div className="flex flex-col gap-4">
            {plans.length > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="-ml-2 w-fit"
                disabled={loading}
                onClick={resetSelection}
              >
                Voltar aos planos
              </Button>
            ) : null}

            <p className="text-sm font-semibold">{selectedPlan.name}</p>

            {cycles.length === 0 ? (
              <p className="text-small text-muted-foreground">
                Não há outros ciclos disponíveis para este plano.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {cycles.map((cycle) => (
                  <CycleOption
                    key={cycle.subscriptionPlanPriceId}
                    cycle={cycle}
                    selected={
                      selectedPriceId === cycle.subscriptionPlanPriceId
                    }
                    disabled={loading}
                    onSelect={() =>
                      setSelectedPriceId(cycle.subscriptionPlanPriceId)
                    }
                  />
                ))}
              </ul>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="primary"
                disabled={selectedPriceId == null || loading}
                aria-busy={loading}
                onClick={handleConfirm}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Processando…
                  </>
                ) : (
                  confirmLabel
                )}
              </Button>
            </DialogFooter>

            {selectedCycle ? (
              <p className="text-small text-muted-foreground">
                Selecionado:{" "}
                {formatPlanPrice(
                  selectedCycle.price,
                  selectedCycle.billingCycle,
                )}
              </p>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

type CycleOptionProps = {
  cycle: SubscriptionAvailablePlanCycleDto;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
};

function CycleOption({
  cycle,
  selected,
  disabled = false,
  onSelect,
}: CycleOptionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`border-border flex flex-col gap-1 rounded-lg border px-4 py-3 text-left transition-colors ${
        selected
          ? "border-primary bg-primary/5"
          : "hover:bg-muted/40"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">
          {cycle.billingCycleLabel}
        </span>
        {cycle.isRecommended ? (
          <Badge variant="success">Recomendado</Badge>
        ) : null}
      </div>
      <span className="text-primary text-sm font-semibold">
        {formatPlanPrice(cycle.price, cycle.billingCycle)}
      </span>
      {cycle.billingCycle !== BillingCycle.Monthly ? (
        <span className="text-small text-muted-foreground">
          Equivale a {formatCurrency(cycle.equivalentMonthlyPrice)} / mês
        </span>
      ) : null}
      {cycle.savingsAmount != null && cycle.savingsAmount > 0 ? (
        <span className="text-small text-muted-foreground">
          Economia de {formatPlanPrice(cycle.savingsAmount)}
          {cycle.savingsPercent != null ? ` (${cycle.savingsPercent}%)` : ""}
        </span>
      ) : null}
    </button>
  );
}

export { SelectSubscriptionPlanPriceDialog };
export type { SelectSubscriptionPlanPriceDialogProps };
