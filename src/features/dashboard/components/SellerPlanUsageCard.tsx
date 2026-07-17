"use client";

import Link from "next/link";
import { CreditCard, Loader2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanUsageProgress } from "@/components/ui/plan-usage-progress";
import { ROUTES } from "@/constants/routes";
import { useCurrentSellerSubscription } from "@/hooks/api/useCurrentSellerSubscription";
import { cn } from "@/lib/utils";

/**
 * Resumo do plano no dashboard do vendedor.
 */
function SellerPlanUsageCard() {
  const subscriptionQuery = useCurrentSellerSubscription();
  const subscription = subscriptionQuery.data;

  if (subscriptionQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-h3">Meu Plano</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2 pb-4">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          <span className="text-small text-muted-foreground">Carregando…</span>
        </CardContent>
      </Card>
    );
  }

  if (subscriptionQuery.isError || !subscription) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-start gap-3">
          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
            <CreditCard className="size-5" aria-hidden />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-h3">Meu Plano</CardTitle>
            <p className="text-small text-muted-foreground">
              Você ainda não possui um plano ativo.
            </p>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <Link
            href={ROUTES.MY_PLAN}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Ver detalhes
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3">
        <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
          <CreditCard className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-h3">Meu Plano</CardTitle>
          <p className="text-small font-medium">{subscription.planName}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pb-4">
        <PlanUsageProgress
          used={subscription.advertisementsUsed}
          limit={subscription.advertisementLimit}
        />
        <Link
          href={ROUTES.MY_PLAN}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-fit",
          )}
        >
          Ver detalhes
        </Link>
      </CardContent>
    </Card>
  );
}

export { SellerPlanUsageCard };
