import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SubscriptionHistoryItemDto } from "@/contracts/seller/subscription";
import { formatDate } from "@/utils/formatDate";

type SubscriptionHistoryCardProps = {
  items: SubscriptionHistoryItemDto[];
};

function SubscriptionHistoryCard({ items }: SubscriptionHistoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Histórico da assinatura</CardTitle>
        <CardDescription>
          Eventos relevantes montados a partir de auditoria e webhooks.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {items.length === 0 ? (
          <p className="text-small text-muted-foreground py-2">
            Nenhum histórico encontrado.
          </p>
        ) : (
          <div className="border-border overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[20rem] text-left text-sm">
              <thead>
                <tr className="bg-muted/50 border-border border-b">
                  <th scope="col" className="px-4 py-3 font-medium">
                    Data
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Descrição
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Resultado
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={`${item.type}-${item.occurredAtUtc}-${item.source}`}
                    className="border-border border-b last:border-b-0"
                  >
                    <td className="text-muted-foreground px-4 py-3 whitespace-nowrap">
                      {formatDate(item.occurredAtUtc)}
                    </td>
                    <td className="px-4 py-3">{item.description}</td>
                    <td className="px-4 py-3">
                      <Badge variant={item.success ? "success" : "destructive"}>
                        {item.success ? "Sucesso" : "Falha"}
                      </Badge>
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

export { SubscriptionHistoryCard };
export type { SubscriptionHistoryCardProps };
