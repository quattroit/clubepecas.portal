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
      "Sim. No MVP, basta cancelar o plano atual e escolher outro.",
  },
  {
    question: "Quando meu plano começa?",
    answer: "Imediatamente após sua contratação.",
  },
  {
    question: "Perco meus anúncios ao cancelar?",
    answer:
      "Não. Porém não será possível publicar novos anúncios enquanto não houver uma assinatura ativa.",
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
