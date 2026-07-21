import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlanUsageProgress } from "@/components/ui/plan-usage-progress";
import type { SellerSubscriptionDto } from "@/contracts/seller/subscription";

type SubscriptionUsageCardProps = {
  subscription: SellerSubscriptionDto;
};

function SubscriptionUsageCard({ subscription }: SubscriptionUsageCardProps) {
  const { plan, indicators } = subscription;
  const percent = indicators.quotaUsagePercent;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Utilização da cota</CardTitle>
        <CardDescription>
          Valores e percentual calculados pela API.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pb-4">
        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="bg-muted/40 rounded-lg px-3 py-2">
            <dt className="text-muted-foreground text-xs">Utilizados</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {plan.advertisementsUsed}
            </dd>
          </div>
          <div className="bg-muted/40 rounded-lg px-3 py-2">
            <dt className="text-muted-foreground text-xs">Restantes</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {plan.isUnlimited ? "Ilimitado" : plan.advertisementsRemaining}
            </dd>
          </div>
          <div className="bg-muted/40 rounded-lg px-3 py-2">
            <dt className="text-muted-foreground text-xs">Limite</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {plan.isUnlimited ? "Ilimitado" : plan.advertisementLimit}
            </dd>
          </div>
        </dl>

        {!plan.isUnlimited ? (
          <>
            <PlanUsageProgress
              used={plan.advertisementsUsed}
              limit={plan.advertisementLimit}
            />
            <p className="text-small text-muted-foreground">
              {percent}% da cota utilizada
            </p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { SubscriptionUsageCard };
export type { SubscriptionUsageCardProps };
