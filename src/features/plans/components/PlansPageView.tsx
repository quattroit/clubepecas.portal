"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CallToAction } from "@/features/plans/components/CallToAction";
import { FaqSection } from "@/features/plans/components/FaqSection";
import { PlanCard } from "@/features/plans/components/PlanCard";
import { PlanComparison } from "@/features/plans/components/PlanComparison";
import { usePlanCtaHref } from "@/features/plans/hooks/usePlanCtaHref";
import { getFeaturedPlanIndex } from "@/features/plans/utils/plan-display";
import { useActiveSubscriptionPlans } from "@/hooks/api/useActiveSubscriptionPlans";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";

function PlansPageView() {
  const plansQuery = useActiveSubscriptionPlans();
  const ctaHref = usePlanCtaHref();
  const plans = plansQuery.data ?? [];
  const featuredIndex = getFeaturedPlanIndex(plans);

  return (
    <div className="flex flex-col gap-16 sm:gap-20 md:gap-24">
      <section
        aria-labelledby="plans-hero-heading"
        className="surface-brand relative overflow-hidden rounded-3xl px-6 py-12 sm:px-10 sm:py-14 md:px-12 md:py-16"
      >
        <div className="relative z-10 flex max-w-2xl flex-col items-start gap-6">
          <h1 id="plans-hero-heading" className="text-display text-brand-foreground">
            Escolha o plano ideal para anunciar suas peças.
          </h1>
          <p className="text-body text-brand-muted max-w-xl">
            Anuncie suas peças automotivas, alcance milhares de compradores e
            gerencie sua loja de forma simples.
          </p>
          <Link
            href={ctaHref}
            className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
          >
            Começar agora
          </Link>
        </div>
      </section>

      <section aria-labelledby="plans-list-heading" className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 id="plans-list-heading" className="text-h2">
            Planos disponíveis
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl">
            Escolha o plano que melhor combina com o tamanho da sua operação.
          </p>
        </div>

        {plansQuery.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16">
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
        plans.length === 0 ? (
          <EmptyState
            title="Nenhum plano disponível"
            description="Em breve novos planos estarão disponíveis para anunciar suas peças."
          />
        ) : null}

        {!plansQuery.isLoading && !plansQuery.isError && plans.length > 0 ? (
          <div
            className={cn(
              "grid items-stretch gap-6 pt-2",
              plans.length >= 4
                ? "sm:grid-cols-2 xl:grid-cols-4"
                : "sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                featured={featuredIndex === index}
              />
            ))}
          </div>
        ) : null}
      </section>

      {!plansQuery.isLoading && !plansQuery.isError && plans.length > 0 ? (
        <PlanComparison plans={plans} />
      ) : null}

      <FaqSection />

      <CallToAction />
    </div>
  );
}

export { PlansPageView };
