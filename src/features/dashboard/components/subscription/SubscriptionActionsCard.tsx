import { CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { SubscriptionAvailableActionsDto } from "@/contracts/seller/subscription";

type SubscriptionActionsCardProps = {
  hasSubscription: boolean;
  actions?: SubscriptionAvailableActionsDto | null;
  onChoosePlan: () => void;
  onUpgrade?: () => void;
  onDowngrade?: () => void;
  onChangeBillingCycle?: () => void;
  onCancel: () => void;
  onReactivate?: () => void;
  cancelLoading?: boolean;
  reactivateLoading?: boolean;
};

function SubscriptionActionsCard({
  hasSubscription,
  actions,
  onChoosePlan,
  onUpgrade,
  onDowngrade,
  onChangeBillingCycle,
  onCancel,
  onReactivate,
  cancelLoading = false,
  reactivateLoading = false,
}: SubscriptionActionsCardProps) {
  if (!hasSubscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-h3">Comece a anunciar</CardTitle>
          <CardDescription>
            Escolha um plano e conclua o pagamento no checkout seguro para
            publicar anúncios na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <EmptyState
            className="border-0 bg-transparent py-6"
            title="Você ainda não possui um plano."
            description="Selecione um plano disponível para vincular à sua loja."
            icon={<CreditCard aria-hidden />}
            action={
              <Button type="button" variant="primary" onClick={onChoosePlan}>
                Assinar Plano
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  const canViewPlans =
    Boolean(actions?.canUpgrade) ||
    Boolean(actions?.canDowngrade) ||
    Boolean(actions?.canChangeBillingCycle) ||
    Boolean(actions?.canReactivate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Ações disponíveis</CardTitle>
        <CardDescription>
          Opções liberadas pela API conforme o estado atual da sua assinatura.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 pb-4">
        <Button
          type="button"
          variant="outline"
          onClick={onChoosePlan}
          disabled={!canViewPlans}
        >
          Ver planos
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onUpgrade}
          disabled={!actions?.canUpgrade || !onUpgrade}
        >
          Upgrade
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onDowngrade}
          disabled={!actions?.canDowngrade || !onDowngrade}
        >
          Downgrade
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onChangeBillingCycle}
          disabled={!actions?.canChangeBillingCycle || !onChangeBillingCycle}
        >
          Alterar ciclo
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!actions?.canRetryPayment}
          title="Reintento de pagamento será habilitado em breve"
        >
          Reintentar pagamento
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!actions?.canSyncPayment}
          title="Sincronização manual disponível no admin"
        >
          Sincronizar
        </Button>
        {actions?.canReactivate ? (
          <Button
            type="button"
            variant="primary"
            onClick={onReactivate}
            disabled={reactivateLoading || !onReactivate}
            aria-busy={reactivateLoading}
          >
            Reativar assinatura
          </Button>
        ) : null}
        <Button
          type="button"
          variant="destructive"
          onClick={onCancel}
          disabled={!actions?.canCancel || cancelLoading}
          aria-busy={cancelLoading}
        >
          Cancelar renovação
        </Button>
      </CardContent>
    </Card>
  );
}

export { SubscriptionActionsCard };
export type { SubscriptionActionsCardProps };
