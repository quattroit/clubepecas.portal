"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: string;
};

const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    question: "Posso trocar de plano depois?",
    answer:
      "Sim. Você poderá alterar seu plano conforme sua necessidade.",
  },
  {
    question: "Quando começa minha assinatura?",
    answer:
      "A assinatura passa a valer imediatamente após sua contratação. Nesta fase do MVP, a ativação é imediata.",
  },
  {
    question: "Existe fidelidade?",
    answer: "Não.",
  },
  {
    question: "Como funciona o limite de anúncios?",
    answer:
      "Cada plano possui uma quantidade máxima de anúncios publicados simultaneamente.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim.",
  },
];

type FaqSectionProps = {
  items?: FaqItem[];
  className?: string;
};

function FaqSection({
  items = DEFAULT_FAQ_ITEMS,
  className,
}: FaqSectionProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      aria-labelledby={`${baseId}-heading`}
      className={cn("flex flex-col gap-6", className)}
    >
      <div className="flex flex-col gap-2">
        <h2 id={`${baseId}-heading`} className="text-h2">
          Perguntas frequentes
        </h2>
        <p className="text-body text-muted-foreground max-w-2xl">
          Tire dúvidas rápidas sobre assinaturas e limites de anúncios.
        </p>
      </div>

      <ul className="border-border divide-border divide-y rounded-xl border">
        {items.map((item, index) => {
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
                className="hover:bg-muted/40 flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors"
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
                className="text-small text-muted-foreground px-4 pb-4"
              >
                {item.answer}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { FaqSection, DEFAULT_FAQ_ITEMS };
export type { FaqSectionProps, FaqItem };
