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

type SubscriptionActionsCardProps = {
  hasActiveSubscription: boolean;
  onChoosePlan: () => void;
  onCancel: () => void;
  cancelLoading?: boolean;
};

function SubscriptionActionsCard({
  hasActiveSubscription,
  onChoosePlan,
  onCancel,
  cancelLoading = false,
}: SubscriptionActionsCardProps) {
  if (!hasActiveSubscription) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Ações</CardTitle>
        <CardDescription>
          Gerencie sua assinatura. Para trocar de plano no MVP, cancele o atual
          e escolha outro.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 pb-4">
        <Button type="button" variant="outline" onClick={onChoosePlan}>
          Ver Planos
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={onCancel}
          disabled={cancelLoading}
          aria-busy={cancelLoading}
        >
          Cancelar Assinatura
        </Button>
      </CardContent>
    </Card>
  );
}

export { SubscriptionActionsCard };
export type { SubscriptionActionsCardProps };
