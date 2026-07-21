import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SubscriptionMessagesCardProps = {
  messages: string[];
};

function SubscriptionMessagesCard({ messages }: SubscriptionMessagesCardProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Indicadores</CardTitle>
        <CardDescription>
          Mensagens geradas pela API com base na situação da assinatura.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ul className="flex flex-col gap-2">
          {messages.map((message) => (
            <li
              key={message}
              className="bg-muted/40 rounded-lg px-3 py-2 text-sm"
            >
              {message}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export { SubscriptionMessagesCard };
export type { SubscriptionMessagesCardProps };
