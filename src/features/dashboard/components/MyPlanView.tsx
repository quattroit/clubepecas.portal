"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { ChoosePlanDialog } from "@/features/dashboard/components/ChoosePlanDialog";
import { AvailablePlansCard } from "@/features/dashboard/components/subscription/AvailablePlansCard";
import { SubscriptionActionsCard } from "@/features/dashboard/components/subscription/SubscriptionActionsCard";
import { SubscriptionFaqCard } from "@/features/dashboard/components/subscription/SubscriptionFaqCard";
import { SubscriptionHistoryCard } from "@/features/dashboard/components/subscription/SubscriptionHistoryCard";
import {
  AvailablePlansSkeleton,
  SubscriptionHistorySkeleton,
  SubscriptionSummarySkeleton,
  SubscriptionUsageSkeleton,
} from "@/features/dashboard/components/subscription/SubscriptionSkeletons";
import { SubscriptionSummaryCard } from "@/features/dashboard/components/subscription/SubscriptionSummaryCard";
import { SubscriptionUsageCard } from "@/features/dashboard/components/subscription/SubscriptionUsageCard";
import { useActiveSubscriptionPlans } from "@/hooks/api/useActiveSubscriptionPlans";
import { useCancelSellerSubscription } from "@/hooks/api/useCancelSellerSubscription";
import { useCurrentSellerSubscription } from "@/hooks/api/useCurrentSellerSubscription";
import { useSellerSubscriptions } from "@/hooks/api/useSellerSubscriptions";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

/**
 * Central de gerenciamento da assinatura do vendedor (Sprint 5.5).
 */
function MyPlanView() {
  const subscriptionQuery = useCurrentSellerSubscription();
  const historyQuery = useSellerSubscriptions();
  const plansQuery = useActiveSubscriptionPlans();
  const cancelMutation = useCancelSellerSubscription();

  const [chooseOpen, setChooseOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const subscription = subscriptionQuery.data ?? null;
  const hasActiveSubscription = subscription !== null;
  const openChoosePlan = () => setChooseOpen(true);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1">Meu plano</h1>
        <p className="text-small text-muted-foreground">
          Central de gerenciamento da assinatura da sua loja.
        </p>
      </div>

      {subscriptionQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar o plano"
          message={getFriendlyErrorMessage(subscriptionQuery.error)}
        />
      ) : null}

      {subscriptionQuery.isLoading ? (
        <>
          <SubscriptionSummarySkeleton />
          <SubscriptionUsageSkeleton />
        </>
      ) : null}

      {!subscriptionQuery.isLoading &&
      !subscriptionQuery.isError &&
      subscription ? (
        <>
          <SubscriptionSummaryCard subscription={subscription} />
          <SubscriptionUsageCard
            subscription={subscription}
            onChoosePlan={openChoosePlan}
          />
        </>
      ) : null}

      {!subscriptionQuery.isLoading && !subscriptionQuery.isError ? (
        <SubscriptionActionsCard
          hasActiveSubscription={hasActiveSubscription}
          onChoosePlan={openChoosePlan}
          onCancel={() => setCancelOpen(true)}
          cancelLoading={cancelMutation.isPending}
        />
      ) : null}

      {plansQuery.isLoading ? <AvailablePlansSkeleton /> : null}

      {plansQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar os planos disponíveis"
          message={getFriendlyErrorMessage(plansQuery.error)}
        />
      ) : null}

      {!plansQuery.isLoading && !plansQuery.isError ? (
        <AvailablePlansCard
          plans={plansQuery.data ?? []}
          currentPlanId={subscription?.subscriptionPlanId}
          onSelectPlan={openChoosePlan}
        />
      ) : null}

      {historyQuery.isLoading ? <SubscriptionHistorySkeleton /> : null}

      {historyQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar o histórico"
          message={getFriendlyErrorMessage(historyQuery.error)}
        />
      ) : null}

      {!historyQuery.isLoading && !historyQuery.isError ? (
        <SubscriptionHistoryCard items={historyQuery.data ?? []} />
      ) : null}

      <SubscriptionFaqCard />

      <ChoosePlanDialog open={chooseOpen} onOpenChange={setChooseOpen} />

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancelar assinatura?"
        description="Sua assinatura será cancelada imediatamente. Você poderá escolher outro plano depois."
        confirmLabel="Cancelar Assinatura"
        cancelLabel="Manter plano"
        confirmVariant="destructive"
        loading={cancelMutation.isPending}
        onConfirm={() => {
          cancelMutation.mutate(undefined, {
            onSuccess: () => setCancelOpen(false),
          });
        }}
      />
    </div>
  );
}

export { MyPlanView };
