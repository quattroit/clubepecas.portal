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
  retryPaymentLabel?: string;
  onChoosePlan: () => void;
  onUpgrade?: () => void;
  onDowngrade?: () => void;
  onChangeBillingCycle?: () => void;
  onCancel: () => void;
  onReactivate?: () => void;
  onRetryPayment?: () => void;
  onNewCharge?: () => void;
  cancelLoading?: boolean;
  reactivateLoading?: boolean;
  retryLoading?: boolean;
  newChargeLoading?: boolean;
};

function SubscriptionActionsCard({
  hasSubscription,
  actions,
  retryPaymentLabel = "Reintentar pagamento",
  onChoosePlan,
  onUpgrade,
  onDowngrade,
  onChangeBillingCycle,
  onCancel,
  onReactivate,
  onRetryPayment,
  onNewCharge,
  cancelLoading = false,
  reactivateLoading = false,
  retryLoading = false,
  newChargeLoading = false,
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

  const canSubscribe = Boolean(actions?.canSubscribe);
  const canReactivate = Boolean(actions?.canReactivate);
  const canManagePlan =
    Boolean(actions?.canUpgrade) ||
    Boolean(actions?.canDowngrade) ||
    Boolean(actions?.canChangeBillingCycle);
  const canRetry = Boolean(actions?.canRetryPayment);
  const canNewCharge = Boolean(actions?.canNewCharge);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Ações disponíveis</CardTitle>
        <CardDescription>
          Opções liberadas pela API conforme o estado atual da sua assinatura.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 pb-4">
        {canSubscribe ? (
          <Button type="button" variant="primary" onClick={onChoosePlan}>
            Assinar novo plano
          </Button>
        ) : null}

        {canReactivate ? (
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

        {canManagePlan ? (
          <>
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
              disabled={
                !actions?.canChangeBillingCycle || !onChangeBillingCycle
              }
            >
              Alterar ciclo
            </Button>
          </>
        ) : null}

        {canRetry ? (
          <Button
            type="button"
            variant="outline"
            onClick={onRetryPayment}
            disabled={retryLoading || !onRetryPayment}
            aria-busy={retryLoading}
          >
            {retryPaymentLabel}
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

        <Button
          type="button"
          variant="outline"
          disabled={!actions?.canSyncPayment}
          title="Sincronização manual disponível no admin"
        >
          Sincronizar
        </Button>
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
