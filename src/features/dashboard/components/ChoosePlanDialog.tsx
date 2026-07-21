"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES } from "@/constants/routes";
import { useActiveSubscriptionPlans } from "@/hooks/api/useActiveSubscriptionPlans";
import { useCreateSellerSubscriptionCheckout } from "@/hooks/api/useCreateSellerSubscriptionCheckout";
import { useSeller } from "@/hooks/api/useSeller";
import { PlanDescription } from "@/features/plans/components/PlanDescription";
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
      onOpenChange(false);
    },
  });

  const seller = sellerQuery.data ?? null;
  const addressComplete = hasCompleteSellerAddress(seller);

  const pendingPlanId = checkoutMutation.isPending
    ? checkoutMutation.variables
    : undefined;

  const pendingPlan = plansQuery.data?.find((plan) => plan.id === pendingPlanId);
  const isPendingFree = pendingPlan != null && pendingPlan.price === 0;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && checkoutMutation.isPending) {
      return;
    }
    if (!nextOpen) {
      checkoutMutation.reset();
    }
    onOpenChange(nextOpen);
  };

  const handleSubscribe = (planId: number, price: number) => {
    if (checkoutMutation.isPending) return;
    // Endereço só é necessário para checkout pago (Asaas).
    if (price > 0 && !addressComplete) return;
    checkoutMutation.mutate(planId);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assinar plano</DialogTitle>
          <DialogDescription>
            Selecione um plano. Planos pagos abrem o checkout seguro do Asaas.
            Planos gratuitos são ativados imediatamente.
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
                onClick={() => {
                  const planId = checkoutMutation.variables;
                  const plan = plansQuery.data?.find((item) => item.id === planId);
                  checkoutMutation.reset();
                  if (planId && plan) {
                    handleSubscribe(planId, plan.price);
                  }
                }}
              >
                Tentar novamente
              </Button>
            ) : null}
          </div>
        ) : null}

        <ul className="flex flex-col gap-3">
          {plansQuery.data?.map((plan) => {
            const isThisPending = pendingPlanId === plan.id;
            const isFree = plan.price === 0;
            const needsAddress = !isFree && !addressComplete;
            const addressBlocked =
              needsAddress && sellerQuery.isSuccess && seller !== null;

            return (
              <li
                key={plan.id}
                className="border-border flex flex-col gap-3 rounded-lg border px-4 py-3"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-h3">{plan.name}</h3>
                    <p className="text-sm font-semibold whitespace-nowrap">
                      {isFree ? "Grátis" : formatCurrency(plan.price)}
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

                {addressBlocked ? (
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
                    aria-busy={isThisPending}
                    onClick={() => handleSubscribe(plan.id, plan.price)}
                  >
                    {isThisPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        {isPendingFree ? "Ativando…" : "Redirecionando…"}
                      </>
                    ) : isFree ? (
                      "Ativar plano"
                    ) : (
                      "Assinar plano"
                    )}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export { ChoosePlanDialog };
