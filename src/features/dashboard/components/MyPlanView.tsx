"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { ChoosePlanDialog } from "@/features/dashboard/components/ChoosePlanDialog";
import { AvailablePlansCard } from "@/features/dashboard/components/subscription/AvailablePlansCard";
import { PaymentHistoryCard } from "@/features/dashboard/components/subscription/PaymentHistoryCard";
import { SelectSubscriptionPlanPriceDialog } from "@/features/dashboard/components/subscription/SelectSubscriptionPlanPriceDialog";
import { SubscriptionActionsCard } from "@/features/dashboard/components/subscription/SubscriptionActionsCard";
import { SubscriptionFaqCard } from "@/features/dashboard/components/subscription/SubscriptionFaqCard";
import { SubscriptionFinancialCard } from "@/features/dashboard/components/subscription/SubscriptionFinancialCard";
import { SubscriptionHistoryCard } from "@/features/dashboard/components/subscription/SubscriptionHistoryCard";
import { SubscriptionMessagesCard } from "@/features/dashboard/components/subscription/SubscriptionMessagesCard";
import {
  SubscriptionCancellationNoticeCard,
  SubscriptionPendingChangeCard,
} from "@/features/dashboard/components/subscription/SubscriptionNotices";
import {
  SubscriptionHistorySkeleton,
  SubscriptionSummarySkeleton,
  SubscriptionUsageSkeleton,
} from "@/features/dashboard/components/subscription/SubscriptionSkeletons";
import { SubscriptionSummaryCard } from "@/features/dashboard/components/subscription/SubscriptionSummaryCard";
import { SubscriptionTimelineCard } from "@/features/dashboard/components/subscription/SubscriptionTimelineCard";
import { SubscriptionUsageCard } from "@/features/dashboard/components/subscription/SubscriptionUsageCard";
import { useCancelSellerSubscriptionRenewal } from "@/hooks/api/useCancelSellerSubscriptionRenewal";
import { useChangeSellerSubscriptionBillingCycle } from "@/hooks/api/useChangeSellerSubscriptionBillingCycle";
import { useCurrentSellerSubscription } from "@/hooks/api/useCurrentSellerSubscription";
import { useDowngradeSellerSubscription } from "@/hooks/api/useDowngradeSellerSubscription";
import { useReactivateSellerSubscription } from "@/hooks/api/useReactivateSellerSubscription";
import { useSellerSubscriptionHistory } from "@/hooks/api/useSellerSubscriptionHistory";
import { useSellerSubscriptionPayments } from "@/hooks/api/useSellerSubscriptionPayments";
import { useUpgradeSellerSubscription } from "@/hooks/api/useUpgradeSellerSubscription";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

type PlanPriceDialogMode = "upgrade" | "downgrade" | "change-cycle" | null;

/**
 * Central de Gestão da Assinatura (Sprint 8.4 + 8.5).
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

  const [chooseOpen, setChooseOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [planPriceMode, setPlanPriceMode] =
    useState<PlanPriceDialogMode>(null);

  const closePlanPriceDialog = () => setPlanPriceMode(null);

  const upgradeMutation = useUpgradeSellerSubscription({
    onActivatedWithoutCheckout: closePlanPriceDialog,
  });
  const downgradeMutation = useDowngradeSellerSubscription();
  const changeCycleMutation = useChangeSellerSubscriptionBillingCycle({
    onActivatedWithoutCheckout: closePlanPriceDialog,
  });
  const cancelRenewalMutation = useCancelSellerSubscriptionRenewal();
  const reactivateMutation = useReactivateSellerSubscription();

  const subscription = subscriptionQuery.data ?? null;
  const openChoosePlan = () => setChooseOpen(true);

  const upgradePlans =
    subscription?.availablePlans.filter(
      (plan) => plan.isUpgrade && plan.isAvailable,
    ) ?? [];
  const downgradePlans =
    subscription?.availablePlans.filter(
      (plan) => plan.isDowngrade && plan.isAvailable,
    ) ?? [];
  const changeCyclePlans =
    subscription?.availablePlans.filter((plan) => plan.isCurrent) ?? [];

  const planPriceDialogPlans =
    planPriceMode === "upgrade"
      ? upgradePlans
      : planPriceMode === "downgrade"
        ? downgradePlans
        : planPriceMode === "change-cycle"
          ? changeCyclePlans
          : [];

  const selectionLoading =
    upgradeMutation.isPending ||
    downgradeMutation.isPending ||
    changeCycleMutation.isPending;

  function handleSelectPrice(subscriptionPlanPriceId: number) {
    if (planPriceMode === "upgrade") {
      upgradeMutation.mutate({ subscriptionPlanPriceId });
      return;
    }
    if (planPriceMode === "downgrade") {
      downgradeMutation.mutate(
        { subscriptionPlanPriceId },
        { onSuccess: closePlanPriceDialog },
      );
      return;
    }
    if (planPriceMode === "change-cycle") {
      changeCycleMutation.mutate({ subscriptionPlanPriceId });
    }
  }

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
          {subscription.pendingChange ? (
            <SubscriptionPendingChangeCard
              pendingChange={subscription.pendingChange}
            />
          ) : null}
          {subscription.cancellationRequested ? (
            <SubscriptionCancellationNoticeCard
              periodEndUtc={subscription.periodEndUtc}
            />
          ) : null}
          <SubscriptionMessagesCard messages={subscription.messages} />
          <SubscriptionFinancialCard subscription={subscription} />
          <SubscriptionUsageCard subscription={subscription} />
          <SubscriptionTimelineCard items={subscription.timeline} />
          <SubscriptionActionsCard
            hasSubscription
            actions={subscription.actions}
            onChoosePlan={openChoosePlan}
            onUpgrade={() => setPlanPriceMode("upgrade")}
            onDowngrade={() => setPlanPriceMode("downgrade")}
            onChangeBillingCycle={() => setPlanPriceMode("change-cycle")}
            onCancel={() => setCancelOpen(true)}
            onReactivate={() => reactivateMutation.mutate()}
            cancelLoading={cancelRenewalMutation.isPending}
            reactivateLoading={reactivateMutation.isPending}
          />
          <AvailablePlansCard
            plans={subscription.availablePlans}
            currentBillingCycle={subscription.billingCycle}
            selectionLoading={selectionLoading}
            onUpgradePrice={
              subscription.actions.canUpgrade
                ? (subscriptionPlanPriceId) =>
                    upgradeMutation.mutate({ subscriptionPlanPriceId })
                : undefined
            }
            onDowngradePrice={
              subscription.actions.canDowngrade
                ? (subscriptionPlanPriceId) =>
                    downgradeMutation.mutate({ subscriptionPlanPriceId })
                : undefined
            }
            onChangeCyclePrice={
              subscription.actions.canChangeBillingCycle
                ? (subscriptionPlanPriceId) =>
                    changeCycleMutation.mutate({ subscriptionPlanPriceId })
                : undefined
            }
          />
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

      <SelectSubscriptionPlanPriceDialog
        open={planPriceMode != null}
        onOpenChange={(open) => {
          if (!open) closePlanPriceDialog();
        }}
        title={
          planPriceMode === "upgrade"
            ? "Fazer upgrade"
            : planPriceMode === "downgrade"
              ? "Agendar downgrade"
              : "Alterar ciclo de cobrança"
        }
        description={
          planPriceMode === "upgrade"
            ? "Escolha o plano e o ciclo. Planos pagos abrem o checkout seguro."
            : planPriceMode === "downgrade"
              ? "O downgrade é agendado para o fim do período atual."
              : "Selecione outro ciclo do seu plano atual."
        }
        confirmLabel={
          planPriceMode === "upgrade"
            ? "Confirmar upgrade"
            : planPriceMode === "downgrade"
              ? "Agendar downgrade"
              : "Confirmar ciclo"
        }
        plans={planPriceDialogPlans}
        excludeBillingCycle={
          planPriceMode === "change-cycle"
            ? subscription?.billingCycle
            : null
        }
        loading={selectionLoading}
        onConfirm={handleSelectPrice}
      />

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancelar renovação?"
        description="A renovação automática será cancelada. Você continua com os benefícios do plano até o fim do período atual e poderá reativar depois, se a API permitir."
        confirmLabel="Cancelar renovação"
        cancelLabel="Manter renovação"
        confirmVariant="destructive"
        loading={cancelRenewalMutation.isPending}
        onConfirm={() => {
          cancelRenewalMutation.mutate(undefined, {
            onSuccess: () => setCancelOpen(false),
          });
        }}
      />
    </div>
  );
}

export { MyPlanView };
