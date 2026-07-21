import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SellerSubscriptionDto } from "@/contracts/seller/subscription";
import {
  paymentMethodLabel,
  paymentStatusLabel,
} from "@/features/dashboard/components/subscription/payment-display";
import {
  subscriptionStatusBadgeVariant,
  subscriptionStatusLabel,
} from "@/features/dashboard/components/subscription/subscription-display";
import { PlanDescription } from "@/features/plans/components/PlanDescription";
import { formatPlanPrice } from "@/features/plans/utils/plan-display";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

type SubscriptionSummaryCardProps = {
  subscription: SellerSubscriptionDto;
};

function SubscriptionSummaryCard({
  subscription,
}: SubscriptionSummaryCardProps) {
  const billingCycle =
    subscription.currentPaymentBillingCycle ?? subscription.billingCycle;
  const billingAmount =
    subscription.currentPaymentAmount != null
      ? formatPlanPrice(subscription.currentPaymentAmount, billingCycle)
      : formatPlanPrice(subscription.price, subscription.billingCycle);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Resumo do plano
            </p>
            <CardTitle className="text-h2">{subscription.planName}</CardTitle>
          </div>
          {subscription.planDescription ? (
            <PlanDescription
              description={subscription.planDescription}
              compact
            />
          ) : null}
        </div>
        <Badge
          variant={subscriptionStatusBadgeVariant(
            subscription.status,
            subscription.gracePeriodUntilUtc,
          )}
        >
          {subscriptionStatusLabel(
            subscription.status,
            subscription.gracePeriodUntilUtc,
          )}
        </Badge>
      </CardHeader>

      <CardContent className="pb-4">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-muted-foreground text-xs">Recorrência</dt>
            <dd className="text-sm font-medium">
              {subscription.billingCycleLabel}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">
              Equivalente mensal
            </dt>
            <dd className="text-sm font-medium">
              {formatCurrency(subscription.equivalentMonthlyPrice)} / mês
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
              {subscription.endDate ? formatDate(subscription.endDate) : "—"}
            </dd>
          </div>
        </dl>

        <div className="border-border mt-5 border-t pt-4" data-slot="subscription-billing">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Status financeiro
          </p>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-muted-foreground text-xs">
                Próxima renovação
              </dt>
              <dd className="text-sm font-medium">
                {subscription.nextBillingDateUtc
                  ? formatDate(subscription.nextBillingDateUtc)
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Valor</dt>
              <dd className="text-sm font-medium">{billingAmount}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Método</dt>
              <dd className="text-sm font-medium">
                {paymentMethodLabel(subscription.currentPaymentMethod)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Status da cobrança</dt>
              <dd className="text-sm font-medium">
                {paymentStatusLabel(subscription.currentPaymentStatus)}
              </dd>
            </div>
            {subscription.gracePeriodUntilUtc ? (
              <div>
                <dt className="text-muted-foreground text-xs">
                  Carência até
                </dt>
                <dd className="text-sm font-medium">
                  {formatDate(subscription.gracePeriodUntilUtc)}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}

export { SubscriptionSummaryCard };
export type { SubscriptionSummaryCardProps };
