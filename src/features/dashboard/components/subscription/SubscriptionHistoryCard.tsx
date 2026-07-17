import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SellerSubscriptionListItemDto } from "@/contracts/seller/subscription";
import {
  subscriptionStatusBadgeVariant,
  subscriptionStatusLabel,
} from "@/features/dashboard/components/subscription/subscription-display";
import { formatDate } from "@/utils/formatDate";

type SubscriptionHistoryCardProps = {
  items: SellerSubscriptionListItemDto[];
};

function SubscriptionHistoryCard({ items }: SubscriptionHistoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Histórico</CardTitle>
        <CardDescription>
          Assinaturas anteriores e a atual, da mais recente para a mais antiga.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {items.length === 0 ? (
          <p className="text-small text-muted-foreground py-2">
            Nenhum histórico encontrado.
          </p>
        ) : (
          <div className="border-border overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="bg-muted/50 border-border border-b">
                  <th scope="col" className="px-4 py-3 font-medium">
                    Plano
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Data início
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Data fim
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-border border-b last:border-b-0">
                    <td className="px-4 py-3 font-medium">{item.planName}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={subscriptionStatusBadgeVariant(item.status)}
                      >
                        {subscriptionStatusLabel(item.status)}
                      </Badge>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 whitespace-nowrap">
                      {formatDate(item.startDate)}
                    </td>
                    <td className="text-muted-foreground px-4 py-3 whitespace-nowrap">
                      {item.endDate ? formatDate(item.endDate) : "—"}
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
