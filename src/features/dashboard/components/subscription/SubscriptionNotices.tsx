import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SubscriptionPendingChangeDto } from "@/contracts/seller/subscription";
import { formatPlanPrice } from "@/features/plans/utils/plan-display";
import { formatDate } from "@/utils/formatDate";

type SubscriptionPendingChangeCardProps = {
  pendingChange: SubscriptionPendingChangeDto;
};

function SubscriptionPendingChangeCard({
  pendingChange,
}: SubscriptionPendingChangeCardProps) {
  return (
    <Card className="border-warning/40 bg-warning/5">
      <CardHeader>
        <CardTitle className="text-h3">Alteração agendada</CardTitle>
        <CardDescription>
          Mudança pendente retornada pela API. Será aplicada na data efetiva.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-muted-foreground text-xs">Novo plano</dt>
            <dd className="text-sm font-medium">{pendingChange.planName}</dd>
          </div>
          {pendingChange.billingCycleLabel ? (
            <div>
              <dt className="text-muted-foreground text-xs">Ciclo</dt>
              <dd className="text-sm font-medium">
                {pendingChange.billingCycleLabel}
              </dd>
            </div>
          ) : null}
          {pendingChange.price != null && pendingChange.billingCycle != null ? (
            <div>
              <dt className="text-muted-foreground text-xs">Valor</dt>
              <dd className="text-sm font-medium">
                {formatPlanPrice(
                  pendingChange.price,
                  pendingChange.billingCycle,
                )}
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-muted-foreground text-xs">Data efetiva</dt>
            <dd className="text-sm font-medium">
              {pendingChange.effectiveDateUtc
                ? formatDate(pendingChange.effectiveDateUtc)
                : "—"}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

type SubscriptionCancellationNoticeCardProps = {
  periodEndUtc?: string | null;
};

function SubscriptionCancellationNoticeCard({
  periodEndUtc,
}: SubscriptionCancellationNoticeCardProps) {
  return (
    <Card className="border-warning/40 bg-warning/5">
      <CardHeader>
        <CardTitle className="text-h3">Cancelamento de renovação</CardTitle>
        <CardDescription>
          A renovação automática foi cancelada. Você mantém os benefícios do
          plano até o fim do período atual.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm">
          {periodEndUtc
            ? `Benefícios disponíveis até ${formatDate(periodEndUtc)}.`
            : "Benefícios disponíveis até o fim do período contratado."}
        </p>
      </CardContent>
    </Card>
  );
}

export {
  SubscriptionPendingChangeCard,
  SubscriptionCancellationNoticeCard,
};
export type {
  SubscriptionPendingChangeCardProps,
  SubscriptionCancellationNoticeCardProps,
};
