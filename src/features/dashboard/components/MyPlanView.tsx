"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PlanUsageProgress } from "@/components/ui/plan-usage-progress";
import { SellerSubscriptionStatus } from "@/contracts/common/enums";
import { ChoosePlanDialog } from "@/features/dashboard/components/ChoosePlanDialog";
import { useCancelSellerSubscription } from "@/hooks/api/useCancelSellerSubscription";
import { useCurrentSellerSubscription } from "@/hooks/api/useCurrentSellerSubscription";
import { useSellerSubscriptions } from "@/hooks/api/useSellerSubscriptions";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

function statusLabel(status: SellerSubscriptionStatus): string {
  switch (status) {
    case SellerSubscriptionStatus.Active:
      return "Ativa";
    case SellerSubscriptionStatus.Cancelled:
      return "Cancelada";
    case SellerSubscriptionStatus.Expired:
      return "Expirada";
    default:
      return "—";
  }
}

function usagePercent(used: number, limit: number): number {
  if (limit <= 0) return 100;
  return Math.min(100, Math.round((used / limit) * 100));
}

function MyPlanView() {
  const subscriptionQuery = useCurrentSellerSubscription();
  const historyQuery = useSellerSubscriptions(
    !subscriptionQuery.isLoading && !subscriptionQuery.isError,
  );
  const cancelMutation = useCancelSellerSubscription();

  const [chooseOpen, setChooseOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const subscription = subscriptionQuery.data;
  const percent = subscription
    ? usagePercent(
        subscription.advertisementsUsed,
        subscription.advertisementLimit,
      )
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1">Meu plano</h1>
        <p className="text-small text-muted-foreground">
          Veja o plano vinculado à sua loja e o histórico de assinaturas.
        </p>
      </div>

      {subscriptionQuery.isLoading ? (
        <div className="flex items-center gap-2 py-10">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          <span className="text-small text-muted-foreground">
            Carregando plano…
          </span>
        </div>
      ) : null}

      {subscriptionQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar o plano"
          message={getFriendlyErrorMessage(subscriptionQuery.error)}
        />
      ) : null}

      {!subscriptionQuery.isLoading &&
      !subscriptionQuery.isError &&
      subscription === null ? (
        <EmptyState
          title="Você ainda não possui um plano."
          description="Escolha um plano para vincular à sua loja. O pagamento será configurado em uma etapa futura."
          icon={<CreditCard aria-hidden />}
          action={
            <Button
              type="button"
              variant="primary"
              onClick={() => setChooseOpen(true)}
            >
              Escolher Plano
            </Button>
          }
        />
      ) : null}

      {!subscriptionQuery.isLoading &&
      !subscriptionQuery.isError &&
      subscription ? (
        <>
          <section
            aria-labelledby="current-plan-heading"
            className="border-border flex flex-col gap-4 rounded-xl border px-5 py-5"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div>
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Plano atual
                </p>
                <h2 id="current-plan-heading" className="text-h2 mt-1">
                  {subscription.planName}
                </h2>
              </div>
              <span className="bg-secondary text-secondary-foreground inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-medium">
                {statusLabel(subscription.status)}
              </span>
            </div>

            {subscription.planDescription ? (
              <p className="text-small text-muted-foreground">
                {subscription.planDescription}
              </p>
            ) : null}

            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-xs">Preço</dt>
                <dd className="text-sm font-medium">
                  {formatCurrency(subscription.price)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">
                  Limite de anúncios
                </dt>
                <dd className="text-sm font-medium">
                  {subscription.advertisementLimit}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Data de início</dt>
                <dd className="text-sm font-medium">
                  {formatDate(subscription.startDate)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Data de término</dt>
                <dd className="text-sm font-medium">
                  {subscription.endDate
                    ? formatDate(subscription.endDate)
                    : "—"}
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setCancelOpen(true)}
              >
                Cancelar Assinatura
              </Button>
            </div>
          </section>

          <section
            aria-labelledby="plan-usage-heading"
            className="border-border flex flex-col gap-4 rounded-xl border px-5 py-5"
          >
            <div>
              <h2 id="plan-usage-heading" className="text-h3">
                Uso do Plano
              </h2>
              <p className="text-small text-muted-foreground mt-1">
                Anúncios publicados contam para o limite do plano.
              </p>
            </div>

            <dl className="grid gap-3 sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground text-xs">
                  Anúncios utilizados
                </dt>
                <dd className="text-sm font-medium">
                  {subscription.advertisementsUsed}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">
                  Anúncios restantes
                </dt>
                <dd className="text-sm font-medium">
                  {subscription.advertisementsRemaining}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Limite total</dt>
                <dd className="text-sm font-medium">
                  {subscription.advertisementLimit}
                </dd>
              </div>
            </dl>

            <PlanUsageProgress
              used={subscription.advertisementsUsed}
              limit={subscription.advertisementLimit}
            />

            {percent >= 80 && percent < 100 ? (
              <div
                role="status"
                className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3"
              >
                <p className="text-small font-medium text-amber-900 dark:text-amber-100">
                  Você está próximo do limite do seu plano.
                </p>
              </div>
            ) : null}

            {percent >= 100 ? (
              <div
                role="status"
                className="border-destructive/40 bg-destructive/10 flex flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-small text-destructive font-medium">
                  Seu limite foi atingido.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setChooseOpen(true)}
                >
                  Escolher outro plano
                </Button>
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      {!subscriptionQuery.isLoading && !subscriptionQuery.isError ? (
        <section
          aria-labelledby="history-heading"
          className="flex flex-col gap-3"
        >
          <h2 id="history-heading" className="text-h3">
            Histórico
          </h2>

          {historyQuery.isLoading ? (
            <p className="text-small text-muted-foreground">
              Carregando histórico…
            </p>
          ) : null}

          {historyQuery.isError ? (
            <ErrorMessage
              title="Não foi possível carregar o histórico"
              message={getFriendlyErrorMessage(historyQuery.error)}
            />
          ) : null}

          {!historyQuery.isLoading &&
          !historyQuery.isError &&
          (historyQuery.data?.length ?? 0) === 0 ? (
            <p className="text-small text-muted-foreground">
              Nenhuma assinatura anterior.
            </p>
          ) : null}

          {!historyQuery.isLoading &&
          !historyQuery.isError &&
          (historyQuery.data?.length ?? 0) > 0 ? (
            <ul className="divide-border border-border divide-y rounded-xl border">
              {historyQuery.data?.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">{item.planName}</p>
                    <p className="text-small text-muted-foreground">
                      {formatCurrency(item.price)} · Limite{" "}
                      {item.advertisementLimit} · {statusLabel(item.status)}
                    </p>
                  </div>
                  <p className="text-small text-muted-foreground whitespace-nowrap">
                    {formatDate(item.startDate)}
                    {item.endDate ? ` — ${formatDate(item.endDate)}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

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
