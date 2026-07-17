"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SubscriptionPlanCatalogItemDto } from "@/contracts/seller/subscription";
import { usePlanCtaHref } from "@/features/plans/hooks/usePlanCtaHref";
import {
  formatPlanAdvertisementLimit,
  formatPlanPrice,
} from "@/features/plans/utils/plan-display";
import { cn } from "@/lib/utils";

type PlanCardProps = {
  plan: SubscriptionPlanCatalogItemDto;
  featured?: boolean;
};

function PlanCard({ plan, featured = false }: PlanCardProps) {
  const ctaHref = usePlanCtaHref();

  return (
    <Card
      className={cn(
        "relative h-full",
        featured && "ring-primary shadow-md ring-2",
      )}
    >
      {featured ? (
        <span className="bg-primary text-primary-foreground absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide whitespace-nowrap">
          Mais escolhido
        </span>
      ) : null}

      <CardHeader className={cn(featured && "pt-6")}>
        <CardTitle className="text-h3">{plan.name}</CardTitle>
        <p className="text-h2 text-primary mt-2">{formatPlanPrice(plan.price)}</p>
        {plan.description ? (
          <CardDescription className="mt-2">{plan.description}</CardDescription>
        ) : null}
      </CardHeader>

      <CardContent>
        <p className="text-small text-muted-foreground">
          <span className="text-foreground font-medium">
            {formatPlanAdvertisementLimit(plan.advertisementLimit)}
          </span>
          {plan.advertisementLimit > 0 ? " permitidos" : null}
        </p>
      </CardContent>

      <CardFooter>
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
  );
}

export { PlanCard };
export type { PlanCardProps };
