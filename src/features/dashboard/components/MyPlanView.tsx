"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { ChoosePlanDialog } from "@/features/dashboard/components/ChoosePlanDialog";
import { AvailablePlansCard } from "@/features/dashboard/components/subscription/AvailablePlansCard";
import { PaymentHistoryCard } from "@/features/dashboard/components/subscription/PaymentHistoryCard";
import { SubscriptionActionsCard } from "@/features/dashboard/components/subscription/SubscriptionActionsCard";
import { SubscriptionFaqCard } from "@/features/dashboard/components/subscription/SubscriptionFaqCard";
import { SubscriptionFinancialCard } from "@/features/dashboard/components/subscription/SubscriptionFinancialCard";
import { SubscriptionHistoryCard } from "@/features/dashboard/components/subscription/SubscriptionHistoryCard";
import { SubscriptionMessagesCard } from "@/features/dashboard/components/subscription/SubscriptionMessagesCard";
import {
  SubscriptionHistorySkeleton,
  SubscriptionSummarySkeleton,
  SubscriptionUsageSkeleton,
} from "@/features/dashboard/components/subscription/SubscriptionSkeletons";
import { SubscriptionSummaryCard } from "@/features/dashboard/components/subscription/SubscriptionSummaryCard";
import { SubscriptionTimelineCard } from "@/features/dashboard/components/subscription/SubscriptionTimelineCard";
import { SubscriptionUsageCard } from "@/features/dashboard/components/subscription/SubscriptionUsageCard";
import { useCancelSellerSubscription } from "@/hooks/api/useCancelSellerSubscription";
import { useCurrentSellerSubscription } from "@/hooks/api/useCurrentSellerSubscription";
import { useSellerSubscriptionHistory } from "@/hooks/api/useSellerSubscriptionHistory";
import { useSellerSubscriptionPayments } from "@/hooks/api/useSellerSubscriptionPayments";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

/**
 * Central de Gestão da Assinatura (Sprint 8.4).
 * Renderiza exclusivamente dados da API — sem regras de negócio no cliente.
 */
function MyPlanView() {
  const subscriptionQuery = useCurrentSellerSubscription();
  const paymentsQuery = useSellerSubscriptionPayments(
    Boolean(subscriptionQuery.data),
  );
  const historyQuery = useSellerSubscriptionHistory(
    Boolean(subscriptionQuery.data),
  );
  const cancelMutation = useCancelSellerSubscription();

  const [chooseOpen, setChooseOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const subscription = subscriptionQuery.data ?? null;
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
          <SubscriptionMessagesCard messages={subscription.messages} />
          <SubscriptionFinancialCard subscription={subscription} />
          <SubscriptionUsageCard subscription={subscription} />
          <SubscriptionTimelineCard items={subscription.timeline} />
          <SubscriptionActionsCard
            hasSubscription
            actions={subscription.actions}
            onChoosePlan={openChoosePlan}
            onCancel={() => setCancelOpen(true)}
            cancelLoading={cancelMutation.isPending}
          />
          <AvailablePlansCard plans={subscription.availablePlans} />
        </>
      ) : null}

      {!subscriptionQuery.isLoading &&
      !subscriptionQuery.isError &&
      !subscription ? (
        <SubscriptionActionsCard
          hasSubscription={false}
          onChoosePlan={openChoosePlan}
          onCancel={() => setCancelOpen(true)}
        />
      ) : null}

      {subscription ? (
        <>
          {paymentsQuery.isLoading ? <SubscriptionHistorySkeleton /> : null}
          {paymentsQuery.isError ? (
            <ErrorMessage
              title="Não foi possível carregar o histórico financeiro"
              message={getFriendlyErrorMessage(paymentsQuery.error)}
            />
          ) : null}
          {!paymentsQuery.isLoading && !paymentsQuery.isError ? (
            <PaymentHistoryCard items={paymentsQuery.data ?? []} />
          ) : null}

          {historyQuery.isLoading ? <SubscriptionHistorySkeleton /> : null}
          {historyQuery.isError ? (
            <ErrorMessage
              title="Não foi possível carregar o histórico da assinatura"
              message={getFriendlyErrorMessage(historyQuery.error)}
            />
          ) : null}
          {!historyQuery.isLoading && !historyQuery.isError ? (
            <SubscriptionHistoryCard items={historyQuery.data ?? []} />
          ) : null}
        </>
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
