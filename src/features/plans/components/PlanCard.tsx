"use client";

import { useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BillingCycle } from "@/contracts/common/enums";
import type { SubscriptionPlanCatalogItemDto } from "@/contracts/seller/subscription";
import { BillingCycleTabs } from "@/features/plans/components/BillingCycleTabs";
import { PlanDescription } from "@/features/plans/components/PlanDescription";
import { usePlanCtaHref } from "@/features/plans/hooks/usePlanCtaHref";
import {
  formatPlanAdvertisementLimit,
  formatPlanPrice,
  getDefaultPlanPrice,
  sortPlanPrices,
} from "@/features/plans/utils/plan-display";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";

/** Acima disso, o card resume e oferece diálogo com o texto completo. */
const DESCRIPTION_PREVIEW_THRESHOLD = 160;

type PlanCardProps = {
  plan: SubscriptionPlanCatalogItemDto;
  featured?: boolean;
};

function PlanCard({ plan, featured = false }: PlanCardProps) {
  const ctaHref = usePlanCtaHref();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const prices = sortPlanPrices(plan.prices);
  const defaultPrice = getDefaultPlanPrice(plan.prices);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(
    defaultPrice?.billingCycle ?? BillingCycle.Monthly,
  );

  const selectedPrice =
    prices.find((price) => price.billingCycle === selectedCycle) ??
    defaultPrice ??
    null;

  const description = plan.description?.trim() ?? "";
  const hasDescription = description.length > 0;
  const isLongDescription = description.length > DESCRIPTION_PREVIEW_THRESHOLD;

  const showEquivalentMonthly =
    selectedPrice != null && selectedPrice.billingCycle !== BillingCycle.Monthly;
  const hasSavings =
    selectedPrice != null &&
    selectedPrice.billingCycle !== BillingCycle.Monthly &&
    (selectedPrice.savingsPercent ?? 0) > 0;

  const priceLabel = selectedPrice
    ? formatPlanPrice(selectedPrice.price, selectedPrice.billingCycle)
    : formatPlanPrice(plan.startingPrice);

  return (
    <div className={cn("relative flex h-full", featured && "pt-3")}>
      {featured ? (
        <span className="bg-primary text-primary-foreground absolute top-0 left-1/2 z-10 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide whitespace-nowrap shadow-xs">
          Mais escolhido
        </span>
      ) : null}

      <Card
        className={cn(
          "flex h-full w-full flex-col overflow-visible",
          featured && "ring-primary shadow-md ring-2",
        )}
      >
        <CardHeader className={cn("shrink-0", featured && "pt-5")}>
          <CardTitle className="text-h3">{plan.name}</CardTitle>

          {prices.length > 1 ? (
            <BillingCycleTabs
              prices={plan.prices}
              selectedCycle={selectedCycle}
              onSelect={setSelectedCycle}
              className="mt-3"
              aria-label={`Ciclo de cobrança do plano ${plan.name}`}
            />
          ) : null}

          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <p className="text-h2 text-primary">{priceLabel}</p>
            {selectedPrice?.isRecommended ? (
              <Badge variant="success">Melhor custo-benefício</Badge>
            ) : null}
          </div>

          {showEquivalentMonthly ? (
            <p className="text-small text-muted-foreground">
              Equivale a{" "}
              {formatCurrency(selectedPrice.equivalentMonthlyPrice)} / mês
            </p>
          ) : null}

          {hasSavings ? (
            <p className="text-success text-small font-medium">
              Economize {selectedPrice.savingsPercent}%
              {selectedPrice.savingsAmount != null
                ? ` (${formatCurrency(selectedPrice.savingsAmount)})`
                : ""}{" "}
              em relação ao mensal
            </p>
          ) : null}
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
          {hasDescription ? (
            <div className="flex flex-col gap-1.5">
              <CardDescription className="line-clamp-3">
                {description}
              </CardDescription>
              {isLongDescription ? (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-primary h-auto self-start px-0 py-0"
                  onClick={() => setDetailsOpen(true)}
                >
                  Ver descrição completa
                </Button>
              ) : null}
            </div>
          ) : (
            <CardDescription className="invisible" aria-hidden>
              —
            </CardDescription>
          )}
          <p className="text-small text-muted-foreground mt-auto">
            <span className="text-foreground font-medium">
              {formatPlanAdvertisementLimit(plan.advertisementLimit)}
            </span>
            {plan.advertisementLimit > 0 ? " permitidos" : null}
          </p>
        </CardContent>

        <CardFooter className="mt-auto shrink-0">
          <Link
            href={ctaHref}
            className={cn(
              buttonVariants({
                variant: featured ? "primary" : "outline",
              }),
              "w-full",
            )}
          >
            Escolher Plano
          </Link>
        </CardFooter>
      </Card>

      {isLongDescription ? (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{plan.name}</DialogTitle>
              <DialogDescription className="text-primary text-base font-semibold">
                {priceLabel}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <PlanDescription description={description} />
              <p className="text-small text-muted-foreground">
                <span className="text-foreground font-medium">
                  {formatPlanAdvertisementLimit(plan.advertisementLimit)}
                </span>
                {plan.advertisementLimit > 0 ? " permitidos" : null}
              </p>
            </div>

            <DialogFooter className="gap-2 sm:justify-between">
              <DialogClose
                render={
                  <Button type="button" variant="outline" />
                }
              >
                Fechar
              </DialogClose>
              <Link
                href={ctaHref}
                className={cn(buttonVariants({ variant: "primary" }))}
                onClick={() => setDetailsOpen(false)}
              >
                Escolher Plano
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}

export { PlanCard };
export type { PlanCardProps };
