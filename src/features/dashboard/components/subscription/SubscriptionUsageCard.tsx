import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlanUsageProgress } from "@/components/ui/plan-usage-progress";
import type { SellerSubscriptionDto } from "@/contracts/seller/subscription";
import { subscriptionUsagePercent } from "@/features/dashboard/components/subscription/subscription-display";

type SubscriptionUsageCardProps = {
  subscription: SellerSubscriptionDto;
  onChoosePlan?: () => void;
};

function SubscriptionUsageCard({
  subscription,
  onChoosePlan,
}: SubscriptionUsageCardProps) {
  const percent = subscriptionUsagePercent(
    subscription.advertisementsUsed,
    subscription.advertisementLimit,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Uso do plano</CardTitle>
        <CardDescription>
          Anúncios publicados contam para o limite. Valores calculados pelo
          servidor.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pb-4">
        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="bg-muted/40 rounded-lg px-3 py-2">
            <dt className="text-muted-foreground text-xs">Utilizados</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {subscription.advertisementsUsed}
            </dd>
          </div>
          <div className="bg-muted/40 rounded-lg px-3 py-2">
            <dt className="text-muted-foreground text-xs">Restantes</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {subscription.advertisementsRemaining}
            </dd>
          </div>
          <div className="bg-muted/40 rounded-lg px-3 py-2">
            <dt className="text-muted-foreground text-xs">Limite total</dt>
            <dd className="text-lg font-semibold tabular-nums">
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
            <p className="text-small font-medium text-amber-950 dark:text-amber-100">
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
              Seu plano atingiu o limite de anúncios.
            </p>
            {onChoosePlan ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onChoosePlan}
              >
                Ver Planos
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { SubscriptionUsageCard };
export type { SubscriptionUsageCardProps };
