import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SellerSubscriptionDto } from "@/contracts/seller/subscription";
import { statusColorToBadgeVariant } from "@/features/dashboard/components/subscription/subscription-display";
import { formatPlanPrice } from "@/features/plans/utils/plan-display";
import { formatDate } from "@/utils/formatDate";

type SubscriptionFinancialCardProps = {
  subscription: SellerSubscriptionDto;
};

function SubscriptionFinancialCard({
  subscription,
}: SubscriptionFinancialCardProps) {
  const { financial, indicators } = subscription;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle className="text-h3">Financeiro</CardTitle>
        {financial.paymentStatusLabel ? (
          <Badge
            variant={statusColorToBadgeVariant(indicators.paymentStatusColor)}
          >
            {financial.paymentStatusLabel}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="pb-4">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-muted-foreground text-xs">Valor</dt>
            <dd className="text-sm font-medium">
              {financial.amount != null
                ? formatPlanPrice(financial.amount)
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Último pagamento</dt>
            <dd className="text-sm font-medium">
              {financial.lastPayment?.paidAtUtc
                ? formatDate(financial.lastPayment.paidAtUtc)
                : financial.lastPayment
                  ? financial.lastPayment.statusLabel
                  : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Próximo pagamento</dt>
            <dd className="text-sm font-medium">
              {financial.nextPayment?.dueDateUtc
                ? formatDate(financial.nextPayment.dueDateUtc)
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Pendências</dt>
            <dd className="text-sm font-medium">
              {financial.hasOverduePayment
                ? "Cobrança vencida"
                : financial.hasPendingPayment
                  ? "Pagamento pendente"
                  : "Nenhuma"}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

export { SubscriptionFinancialCard };
export type { SubscriptionFinancialCardProps };
