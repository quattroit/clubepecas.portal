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
  onCancel: () => void;
  cancelLoading?: boolean;
};

function SubscriptionActionsCard({
  hasSubscription,
  actions,
  onChoosePlan,
  onCancel,
  cancelLoading = false,
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
    Boolean(actions?.canReactivate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Ações disponíveis</CardTitle>
        <CardDescription>
          Disponibilidade definida pela API. Alterações de plano chegam na
          Sprint 8.5.
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
          disabled={!actions?.canUpgrade}
          title={
            actions?.canUpgrade
              ? "Preparatório — alteração na Sprint 8.5"
              : undefined
          }
        >
          Upgrade
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!actions?.canDowngrade}
          title={
            actions?.canDowngrade
              ? "Preparatório — alteração na Sprint 8.5"
              : undefined
          }
        >
          Downgrade
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
        <Button
          type="button"
          variant="destructive"
          onClick={onCancel}
          disabled={!actions?.canCancel || cancelLoading}
          aria-busy={cancelLoading}
        >
          Cancelar assinatura
        </Button>
      </CardContent>
    </Card>
  );
}

export { SubscriptionActionsCard };
export type { SubscriptionActionsCardProps };
