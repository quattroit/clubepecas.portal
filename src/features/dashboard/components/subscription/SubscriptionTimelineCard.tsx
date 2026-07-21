import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SubscriptionTimelineItemDto } from "@/contracts/seller/subscription";
import { formatDate } from "@/utils/formatDate";

type SubscriptionTimelineCardProps = {
  items: SubscriptionTimelineItemDto[];
};

function timelineStatusLabel(status: string): string {
  switch (status) {
    case "done":
      return "Concluído";
    case "current":
      return "Atual";
    case "upcoming":
      return "Próximo";
    default:
      return status;
  }
}

function SubscriptionTimelineCard({ items }: SubscriptionTimelineCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Linha do tempo</CardTitle>
        <CardDescription>
          Eventos da assinatura montados pela API a partir dos dados existentes.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {items.length === 0 ? (
          <p className="text-small text-muted-foreground">
            Nenhum evento na linha do tempo.
          </p>
        ) : (
          <ol className="border-border relative space-y-4 border-l pl-4">
            {items.map((item) => (
              <li key={`${item.type}-${item.occurredAtUtc}`} className="relative">
                <span className="bg-primary absolute top-1.5 -left-[1.3rem] size-2.5 rounded-full" />
                <p className="text-sm font-medium">{item.description}</p>
                <p className="text-muted-foreground text-xs">
                  {formatDate(item.occurredAtUtc)} ·{" "}
                  {timelineStatusLabel(item.status)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

export { SubscriptionTimelineCard };
export type { SubscriptionTimelineCardProps };
