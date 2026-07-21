import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type {
  SellerSubscriptionDto,
  SubscriptionAvailableActionsDto,
} from "@/contracts/seller/subscription";
import { statusColorToBadgeVariant } from "@/features/dashboard/components/subscription/subscription-display";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

type SubscriptionFinancialCardProps = {
  subscription: SellerSubscriptionDto;
  actions?: SubscriptionAvailableActionsDto | null;
  onRetryPayment?: () => void;
  onNewCharge?: () => void;
  retryLoading?: boolean;
  newChargeLoading?: boolean;
};

function formatMoney(value: number | null | undefined): string {
  if (value == null) return "—";
  return formatCurrency(value);
}

function SubscriptionFinancialCard({
  subscription,
  actions,
  onRetryPayment,
  onNewCharge,
  retryLoading = false,
  newChargeLoading = false,
}: SubscriptionFinancialCardProps) {
  const { financial, indicators } = subscription;
  const canRetry = Boolean(actions?.canRetryPayment);
  const canNewCharge = Boolean(actions?.canNewCharge);

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
      <CardContent className="flex flex-col gap-4 pb-4">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-muted-foreground text-xs">Total pago</dt>
            <dd className="text-sm font-medium">
              {formatMoney(financial.totalPaid)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">
              Valor de vida (LTV)
            </dt>
            <dd className="text-sm font-medium">
              {formatMoney(financial.lifetimeValue)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Próximo valor</dt>
            <dd className="text-sm font-medium">
              {formatMoney(
                financial.nextInvoiceValue ?? financial.nextPayment?.amount,
              )}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Próxima data</dt>
            <dd className="text-sm font-medium">
              {financial.nextInvoiceDate
                ? formatDate(financial.nextInvoiceDate)
                : financial.nextPayment?.dueDateUtc
                  ? formatDate(financial.nextPayment.dueDateUtc)
                  : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">
              Economia no ciclo atual
            </dt>
            <dd className="text-sm font-medium">
              {formatMoney(financial.currentPlanSavings)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Economia anual</dt>
            <dd className="text-sm font-medium">
              {formatMoney(financial.annualSavings)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">
              Economia trimestral
            </dt>
            <dd className="text-sm font-medium">
              {formatMoney(financial.quarterlySavings)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Pendências</dt>
            <dd className="text-sm font-medium">
              {financial.totalPendingInvoices > 0
                ? `${financial.totalPendingInvoices} fatura${financial.totalPendingInvoices === 1 ? "" : "s"}`
                : financial.hasOverduePayment
                  ? "Cobrança vencida"
                  : financial.hasPendingPayment
                    ? "Pagamento pendente"
                    : "Nenhuma"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Faturas pagas</dt>
            <dd className="text-sm font-medium">
              {financial.totalInvoices.toLocaleString("pt-BR")}
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
        </dl>

        {canRetry || canNewCharge ? (
          <div className="flex flex-wrap gap-2 border-t pt-4">
            {canRetry ? (
              <Button
                type="button"
                variant="primary"
                onClick={onRetryPayment}
                disabled={retryLoading || !onRetryPayment}
                aria-busy={retryLoading}
              >
                Pagar agora
              </Button>
            ) : null}
            {canNewCharge ? (
              <Button
                type="button"
                variant="outline"
                onClick={onNewCharge}
                disabled={newChargeLoading || !onNewCharge}
                aria-busy={newChargeLoading}
              >
                Gerar nova cobrança
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { SubscriptionFinancialCard };
export type { SubscriptionFinancialCardProps };
