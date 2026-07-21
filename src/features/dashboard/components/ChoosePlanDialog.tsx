"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES } from "@/constants/routes";
import { BillingCycle } from "@/contracts/common/enums";
import type { SubscriptionPlanCatalogItemDto } from "@/contracts/seller/subscription";
import { useActiveSubscriptionPlans } from "@/hooks/api/useActiveSubscriptionPlans";
import { useCreateSellerSubscriptionCheckout } from "@/hooks/api/useCreateSellerSubscriptionCheckout";
import { useSeller } from "@/hooks/api/useSeller";
import { BillingCycleTabs } from "@/features/plans/components/BillingCycleTabs";
import { PlanDescription } from "@/features/plans/components/PlanDescription";
import {
  formatPlanAdvertisementLimit,
  formatPlanPrice,
  getDefaultPlanPrice,
  isFreeMonthlyOnlyPlan,
} from "@/features/plans/utils/plan-display";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { formatCurrency } from "@/utils/formatCurrency";
import { hasCompleteSellerAddress } from "@/utils/sellerAddress";

type ChoosePlanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ChoosePlanDialog({ open, onOpenChange }: ChoosePlanDialogProps) {
  const sellerQuery = useSeller();
  const plansQuery = useActiveSubscriptionPlans(open);
  const checkoutMutation = useCreateSellerSubscriptionCheckout({
    onActivatedWithoutCheckout: () => {
      handleReset();
      onOpenChange(false);
    },
  });

  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlanCatalogItemDto | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle | null>(
    null,
  );

  const seller = sellerQuery.data ?? null;
  const addressComplete = hasCompleteSellerAddress(seller);

  const pendingVariables = checkoutMutation.isPending
    ? checkoutMutation.variables
    : undefined;
  const pendingPlan = plansQuery.data?.find(
    (plan) => plan.id === pendingVariables?.subscriptionPlanId,
  );
  const pendingPrice = pendingPlan?.prices.find(
    (price) => price.billingCycle === pendingVariables?.billingCycle,
  );
  const isPendingFree = pendingPrice != null && pendingPrice.price === 0;

  function handleReset() {
    setSelectedPlan(null);
    setSelectedCycle(null);
    checkoutMutation.reset();
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && checkoutMutation.isPending) {
      return;
    }
    if (!nextOpen) {
      handleReset();
    }
    onOpenChange(nextOpen);
  };

  const handleBack = () => {
    if (checkoutMutation.isPending) return;
    setSelectedPlan(null);
    setSelectedCycle(null);
    checkoutMutation.reset();
  };

  const handlePickPlan = (plan: SubscriptionPlanCatalogItemDto) => {
    if (checkoutMutation.isPending) return;

    if (isFreeMonthlyOnlyPlan(plan)) {
      checkoutMutation.mutate({
        subscriptionPlanId: plan.id,
        billingCycle: BillingCycle.Monthly,
      });
      return;
    }

    setSelectedPlan(plan);
    setSelectedCycle(getDefaultPlanPrice(plan.prices)?.billingCycle ?? BillingCycle.Monthly);
  };

  const handleSubscribe = () => {
    if (!selectedPlan || selectedCycle == null || checkoutMutation.isPending) {
      return;
    }
    const price = selectedPlan.prices.find(
      (item) => item.billingCycle === selectedCycle,
    );
    if (!price) return;
    // Endereço só é necessário para checkout pago (Asaas).
    if (price.price > 0 && !addressComplete) return;
    checkoutMutation.mutate({
      subscriptionPlanId: selectedPlan.id,
      billingCycle: selectedCycle,
    });
  };

  const handleRetry = () => {
    const variables = checkoutMutation.variables;
    checkoutMutation.reset();
    if (variables) {
      checkoutMutation.mutate(variables);
    }
  };

  const selectedPrice =
    selectedPlan && selectedCycle != null
      ? selectedPlan.prices.find((price) => price.billingCycle === selectedCycle)
      : undefined;
  const needsAddressForSelection =
    selectedPrice != null && selectedPrice.price > 0 && !addressComplete;
  const addressBlockedForSelection =
    needsAddressForSelection && sellerQuery.isSuccess && seller !== null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          {selectedPlan ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="-ml-2 mb-1 w-fit"
              onClick={handleBack}
              disabled={checkoutMutation.isPending}
            >
              <ArrowLeft className="size-4" aria-hidden />
              Voltar
            </Button>
          ) : null}
          <DialogTitle>
            {selectedPlan ? `Ciclo de cobrança — ${selectedPlan.name}` : "Assinar plano"}
          </DialogTitle>
          <DialogDescription>
            {selectedPlan
              ? "Escolha o ciclo de cobrança para continuar."
              : "Selecione um plano. Planos pagos abrem o checkout seguro do Asaas. Planos gratuitos são ativados imediatamente."}
          </DialogDescription>
        </DialogHeader>

        {plansQuery.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            <span className="text-small text-muted-foreground">
              Carregando planos…
            </span>
          </div>
        ) : null}

        {plansQuery.isError ? (
          <ErrorMessage
            title="Não foi possível carregar os planos"
            message={getFriendlyErrorMessage(plansQuery.error)}
          />
        ) : null}

        {!plansQuery.isLoading &&
        !plansQuery.isError &&
        (plansQuery.data?.length ?? 0) === 0 ? (
          <p className="text-small text-muted-foreground py-6 text-center">
            Nenhum plano ativo disponível no momento.
          </p>
        ) : null}

        {checkoutMutation.isError ? (
          <div className="flex flex-col gap-2">
            <ErrorMessage
              title="Não foi possível iniciar o pagamento"
              message={getFriendlyErrorMessage(checkoutMutation.error)}
            />
            {checkoutMutation.variables ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="self-start"
                onClick={handleRetry}
              >
                Tentar novamente
              </Button>
            ) : null}
          </div>
        ) : null}

        {!selectedPlan && !plansQuery.isLoading && !plansQuery.isError ? (
          <ul className="flex flex-col gap-3">
            {plansQuery.data?.map((plan) => {
              const isThisPending = pendingPlan?.id === plan.id;
              const isFree = isFreeMonthlyOnlyPlan(plan);

              return (
                <li
                  key={plan.id}
                  className="border-border flex flex-col gap-3 rounded-lg border px-4 py-3"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-h3">{plan.name}</h3>
                      <p className="text-sm font-semibold whitespace-nowrap">
                        {isFree
                          ? "Grátis"
                          : `a partir de ${formatPlanPrice(plan.startingPrice)}`}
                      </p>
                    </div>
                    {plan.description ? (
                      <PlanDescription
                        description={plan.description}
                        compact
                        className="mt-1"
                      />
                    ) : null}
                    <p className="text-small text-muted-foreground">
                      Limite de anúncios:{" "}
                      <span className="text-foreground font-medium">
                        {plan.advertisementLimit}
                      </span>
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    disabled={checkoutMutation.isPending}
                    aria-busy={isThisPending}
                    onClick={() => handlePickPlan(plan)}
                  >
                    {isThisPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        {isPendingFree ? "Ativando…" : "Redirecionando…"}
                      </>
                    ) : isFree ? (
                      "Ativar plano"
                    ) : (
                      "Continuar"
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {selectedPlan ? (
          <div className="flex flex-col gap-4">
            <BillingCycleTabs
              prices={selectedPlan.prices}
              selectedCycle={selectedCycle ?? BillingCycle.Monthly}
              onSelect={setSelectedCycle}
            />

            {selectedPrice ? (
              <div className="border-border flex flex-col gap-2 rounded-lg border px-4 py-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="text-h3 text-primary">
                    {formatPlanPrice(selectedPrice.price, selectedPrice.billingCycle)}
                  </p>
                  {selectedPrice.isRecommended ? (
                    <Badge variant="success">Melhor custo-benefício</Badge>
                  ) : null}
                </div>

                {selectedPrice.billingCycle !== BillingCycle.Monthly ? (
                  <p className="text-small text-muted-foreground">
                    Equivale a{" "}
                    {formatCurrency(selectedPrice.equivalentMonthlyPrice)} / mês
                  </p>
                ) : null}

                {selectedPrice.billingCycle !== BillingCycle.Monthly &&
                (selectedPrice.savingsPercent ?? 0) > 0 ? (
                  <p className="text-success text-small font-medium">
                    Economize {selectedPrice.savingsPercent}%
                    {selectedPrice.savingsAmount != null
                      ? ` (${formatCurrency(selectedPrice.savingsAmount)})`
                      : ""}{" "}
                    em relação ao mensal
                  </p>
                ) : null}

                {selectedPrice.description ? (
                  <p className="text-small text-muted-foreground">
                    {selectedPrice.description}
                  </p>
                ) : null}

                <p className="text-small text-muted-foreground">
                  {formatPlanAdvertisementLimit(selectedPlan.advertisementLimit)}
                </p>
              </div>
            ) : null}

            {addressBlockedForSelection ? (
              <div className="flex flex-col gap-2">
                <p className="text-destructive text-xs">
                  Complete o endereço no perfil antes de assinar este plano.
                </p>
                <Link
                  href={ROUTES.PROFILE}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                  })}
                >
                  Ir para o perfil
                </Link>
              </div>
            ) : (
              <Button
                type="button"
                variant="primary"
                disabled={checkoutMutation.isPending}
                aria-busy={checkoutMutation.isPending}
                onClick={handleSubscribe}
              >
                {checkoutMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Redirecionando…
                  </>
                ) : (
                  "Assinar plano"
                )}
              </Button>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export { ChoosePlanDialog };
