import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SellerSubscriptionDto } from "@/contracts/seller/subscription";
import { statusColorToBadgeVariant } from "@/features/dashboard/components/subscription/subscription-display";
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
  const billingAmount = formatPlanPrice(
    subscription.recurringAmount,
    subscription.billingCycle,
  );

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Resumo da assinatura
            </p>
            <CardTitle className="text-h2">{subscription.plan.name}</CardTitle>
          </div>
          {subscription.plan.description ? (
            <PlanDescription
              description={subscription.plan.description}
              compact
            />
          ) : null}
        </div>
        <Badge
          variant={statusColorToBadgeVariant(
            subscription.indicators.subscriptionStatusColor,
          )}
        >
          {subscription.statusLabel}
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
            <dt className="text-muted-foreground text-xs">Valor da recorrência</dt>
            <dd className="text-sm font-medium">{billingAmount}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Contratação</dt>
            <dd className="text-sm font-medium">
              {formatDate(subscription.contractedAtUtc)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Dias restantes</dt>
            <dd className="text-sm font-medium">
              {subscription.remainingDays != null
                ? `${subscription.remainingDays}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Início do período</dt>
            <dd className="text-sm font-medium">
              {formatDate(subscription.periodStartUtc)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Fim do período</dt>
            <dd className="text-sm font-medium">
              {subscription.periodEndUtc
                ? formatDate(subscription.periodEndUtc)
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Próxima cobrança</dt>
            <dd className="text-sm font-medium">
              {subscription.nextBillingDateUtc
                ? formatDate(subscription.nextBillingDateUtc)
                : "—"}
            </dd>
          </div>
          {subscription.equivalentMonthlyPrice != null ? (
            <div>
              <dt className="text-muted-foreground text-xs">
                Equivalente mensal
              </dt>
              <dd className="text-sm font-medium">
                {formatCurrency(subscription.equivalentMonthlyPrice)} / mês
              </dd>
            </div>
          ) : null}
          {subscription.isGracePeriod && subscription.gracePeriodUntilUtc ? (
            <div>
              <dt className="text-muted-foreground text-xs">Grace até</dt>
              <dd className="text-sm font-medium">
                {formatDate(subscription.gracePeriodUntilUtc)}
              </dd>
            </div>
          ) : null}
        </dl>
      </CardContent>
    </Card>
  );
}

export { SubscriptionSummaryCard };
export type { SubscriptionSummaryCardProps };
