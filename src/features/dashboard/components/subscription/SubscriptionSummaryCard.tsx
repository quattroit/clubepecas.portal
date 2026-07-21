import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SellerSubscriptionDto } from "@/contracts/seller/subscription";
import {
  subscriptionStatusBadgeVariant,
  subscriptionStatusLabel,
} from "@/features/dashboard/components/subscription/subscription-display";
import { PlanDescription } from "@/features/plans/components/PlanDescription";
import { formatPlanPrice } from "@/features/plans/utils/plan-display";
import { formatDate } from "@/utils/formatDate";

type SubscriptionSummaryCardProps = {
  subscription: SellerSubscriptionDto;
};

function SubscriptionSummaryCard({
  subscription,
}: SubscriptionSummaryCardProps) {
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
        <Badge variant={subscriptionStatusBadgeVariant(subscription.status)}>
          {subscriptionStatusLabel(subscription.status)}
        </Badge>
      </CardHeader>

      <CardContent className="pb-4">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-muted-foreground text-xs">Preço mensal</dt>
            <dd className="text-sm font-medium">
              {formatPlanPrice(subscription.price)}
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

        {/* Reserva de layout para o épico de pagamentos */}
        <div
          className="border-border mt-5 border-t pt-4"
          data-slot="subscription-billing-placeholder"
        >
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Pagamento
          </p>
          <p className="text-small text-muted-foreground mt-1">
            Informações de cobrança e faturas estarão disponíveis em breve.
          </p>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-muted-foreground text-xs">Próxima cobrança</dt>
              <dd className="text-muted-foreground text-sm">Em breve</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Forma de pagamento</dt>
              <dd className="text-muted-foreground text-sm">Em breve</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Status da cobrança</dt>
              <dd className="text-muted-foreground text-sm">Em breve</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Faturas</dt>
              <dd className="text-muted-foreground text-sm">Em breve</dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}

export { SubscriptionSummaryCard };
export type { SubscriptionSummaryCardProps };
