import { Receipt } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { SellerPaymentDto } from "@/contracts/seller/payments";
import {
  paymentMethodLabel,
  paymentStatusLabel,
  paymentTypeLabel,
} from "@/features/dashboard/components/subscription/payment-display";
import { formatPlanPrice } from "@/features/plans/utils/plan-display";
import { formatDate } from "@/utils/formatDate";

type PaymentHistoryCardProps = {
  items: SellerPaymentDto[];
};

function PaymentHistoryCard({ items }: PaymentHistoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Histórico financeiro</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            icon={<Receipt />}
            title="Nenhum pagamento encontrado"
            description="Quando houver cobranças, renovações ou reembolsos, eles aparecerão aqui."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-border text-muted-foreground border-b text-xs">
                  <th className="pb-2 pr-3 font-medium">Data</th>
                  <th className="pb-2 pr-3 font-medium">Tipo</th>
                  <th className="pb-2 pr-3 font-medium">Valor</th>
                  <th className="pb-2 pr-3 font-medium">Método</th>
                  <th className="pb-2 pr-3 font-medium">Status</th>
                  <th className="pb-2 font-medium">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-border border-b last:border-0">
                    <td className="py-3 pr-3 whitespace-nowrap">
                      {formatDate(item.createdAtUtc)}
                    </td>
                    <td className="py-3 pr-3">{paymentTypeLabel(item.type)}</td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      {formatPlanPrice(item.amount)}
                    </td>
                    <td className="py-3 pr-3">
                      {paymentMethodLabel(item.method)}
                    </td>
                    <td className="py-3 pr-3">
                      {paymentStatusLabel(item.status)}
                    </td>
                    <td className="text-muted-foreground py-3">
                      {item.description ?? item.planName ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { PaymentHistoryCard };
export type { PaymentHistoryCardProps };
