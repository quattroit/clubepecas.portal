"use client";

import { Loader2 } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActiveSubscriptionPlans } from "@/hooks/api/useActiveSubscriptionPlans";
import { useCreateSellerSubscription } from "@/hooks/api/useCreateSellerSubscription";
import { PlanDescription } from "@/features/plans/components/PlanDescription";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { formatCurrency } from "@/utils/formatCurrency";

type ChoosePlanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ChoosePlanDialog({ open, onOpenChange }: ChoosePlanDialogProps) {
  const plansQuery = useActiveSubscriptionPlans(open);
  const createMutation = useCreateSellerSubscription();

  const handleSubscribe = (planId: string) => {
    createMutation.mutate(
      { subscriptionPlanId: planId },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Escolher plano</DialogTitle>
          <DialogDescription>
            Selecione um plano ativo para vincular à sua loja. Não há cobrança
            nesta etapa.
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

        {createMutation.isError ? (
          <ErrorMessage
            title="Não foi possível assinar"
            message={getFriendlyErrorMessage(createMutation.error)}
          />
        ) : null}

        <ul className="flex flex-col gap-3">
          {plansQuery.data?.map((plan) => (
            <li
              key={plan.id}
              className="border-border flex flex-col gap-3 rounded-lg border px-4 py-3"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-h3">{plan.name}</h3>
                  <p className="text-sm font-semibold whitespace-nowrap">
                    {formatCurrency(plan.price)}
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
                disabled={createMutation.isPending}
                aria-busy={createMutation.isPending}
                onClick={() => handleSubscribe(plan.id)}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Assinando…
                  </>
                ) : (
                  "Assinar"
                )}
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export { ChoosePlanDialog };
