"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "Posso trocar de plano?",
    answer:
      "Sim. Você pode fazer upgrade, downgrade ou alterar o ciclo de cobrança diretamente nesta página, conforme as opções disponíveis para a sua assinatura.",
  },
  {
    question: "Quando meu plano começa?",
    answer:
      "Imediatamente após a confirmação do pagamento. Em planos demonstrativos, o acesso começa na ativação.",
  },
  {
    question: "O que acontece se eu cancelar a renovação?",
    answer:
      "O cancelamento encerra apenas a renovação automática. Você mantém os benefícios do plano — inclusive publicar e gerenciar anúncios — até o fim do período já contratado. Após essa data, os anúncios publicados são pausados até haver uma assinatura ativa novamente.",
  },
  {
    question: "Posso reativar depois de cancelar a renovação?",
    answer:
      "Sim. Enquanto o período atual estiver vigente, você pode reativar a renovação automática. Depois do vencimento, escolha um novo plano para voltar a publicar.",
  },
  {
    question: "O limite considera quais anúncios?",
    answer: "Apenas anúncios publicados.",
  },
] as const;

function SubscriptionFaqCard() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Perguntas frequentes</CardTitle>
        <CardDescription>
          Dúvidas comuns sobre assinatura e limite de anúncios.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ul className="border-border divide-border divide-y rounded-xl border">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <li key={item.question}>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="hover:bg-muted/40 flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="text-sm font-medium">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "text-muted-foreground size-4 shrink-0 transition-transform",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="text-small text-muted-foreground px-4 pb-3"
                >
                  {item.answer}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export { SubscriptionFaqCard };
