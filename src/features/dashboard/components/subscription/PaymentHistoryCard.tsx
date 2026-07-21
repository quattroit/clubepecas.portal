import { Receipt } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { SubscriptionPaymentDto } from "@/contracts/seller/subscription";
import { formatPlanPrice } from "@/features/plans/utils/plan-display";
import { formatDate } from "@/utils/formatDate";

type PaymentHistoryCardProps = {
  items: SubscriptionPaymentDto[];
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
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-border text-muted-foreground border-b text-xs">
                  <th className="pb-2 pr-3 font-medium">Data</th>
                  <th className="pb-2 pr-3 font-medium">Valor</th>
                  <th className="pb-2 pr-3 font-medium">Ciclo</th>
                  <th className="pb-2 pr-3 font-medium">Status</th>
                  <th className="pb-2 pr-3 font-medium">Vencimento</th>
                  <th className="pb-2 pr-3 font-medium">Pago em</th>
                  <th className="pb-2 pr-3 font-medium">Método</th>
                  <th className="pb-2 font-medium">Links</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-border border-b last:border-0"
                  >
                    <td className="py-3 pr-3 whitespace-nowrap">
                      {formatDate(item.createdAtUtc)}
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      {formatPlanPrice(item.amount)}
                    </td>
                    <td className="py-3 pr-3">{item.billingCycleLabel}</td>
                    <td className="py-3 pr-3">{item.statusLabel}</td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      {item.dueDateUtc ? formatDate(item.dueDateUtc) : "—"}
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      {item.paidAtUtc ? formatDate(item.paidAtUtc) : "—"}
                    </td>
                    <td className="py-3 pr-3">{item.methodLabel}</td>
                    <td className="py-3">
                      <div className="flex flex-col gap-1">
                        {item.invoiceUrl ? (
                          <a
                            href={item.invoiceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary text-xs underline-offset-2 hover:underline"
                          >
                            Fatura
                          </a>
                        ) : null}
                        {item.receiptUrl ? (
                          <a
                            href={item.receiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary text-xs underline-offset-2 hover:underline"
                          >
                            Recibo
                          </a>
                        ) : null}
                        {!item.invoiceUrl && !item.receiptUrl ? "—" : null}
                      </div>
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
