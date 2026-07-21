import type { SubscriptionPlanCatalogItemDto } from "@/contracts/seller/subscription";
import {
  formatPlanAdvertisementLimit,
  formatPlanPrice,
} from "@/features/plans/utils/plan-display";
import { cn } from "@/lib/utils";

type PlanComparisonProps = {
  plans: SubscriptionPlanCatalogItemDto[];
  className?: string;
};

function PlanComparison({ plans, className }: PlanComparisonProps) {
  if (plans.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="plan-comparison-heading"
      className={cn("flex flex-col gap-6", className)}
    >
      <div className="flex flex-col gap-2">
        <h2 id="plan-comparison-heading" className="text-h2">
          Compare os planos
        </h2>
        <p className="text-body text-muted-foreground max-w-2xl">
          Veja lado a lado o que cada plano oferece para a sua loja.
        </p>
      </div>

      <div className="border-border overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="bg-muted/50 border-border border-b">
              <th scope="col" className="text-muted-foreground px-4 py-3 font-medium">
                Recurso
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.id}
                  scope="col"
                  className="text-foreground px-4 py-3 font-semibold"
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-border border-b">
              <th scope="row" className="text-muted-foreground px-4 py-3 font-medium">
                Preço
              </th>
              {plans.map((plan) => (
                <td key={plan.id} className="px-4 py-3 font-medium">
                  A partir de {formatPlanPrice(plan.startingPrice)}
                </td>
              ))}
            </tr>
            <tr className="border-border border-b">
              <th scope="row" className="text-muted-foreground px-4 py-3 font-medium">
                Limite de anúncios
              </th>
              {plans.map((plan) => (
                <td key={plan.id} className="px-4 py-3">
                  {formatPlanAdvertisementLimit(plan.advertisementLimit)}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="text-muted-foreground px-4 py-3 font-medium">
                Status
              </th>
              {plans.map((plan) => (
                <td key={plan.id} className="px-4 py-3">
                  Ativo
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export { PlanComparison };
export type { PlanComparisonProps };
