"use client";

import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IndicatedByRepresentativeCardProps = {
  name: string;
  representativeCode: string;
  /** Exibe botão Trocar código (apenas sem vínculo definitivo). */
  onChangeCode?: () => void;
  className?: string;
};

/**
 * Card de indicação (cadastro / checkout) — Sprint 10.3.
 */
function IndicatedByRepresentativeCard({
  name,
  representativeCode,
  onChangeCode,
  className,
}: IndicatedByRepresentativeCardProps) {
  return (
    <div
      className={cn(
        "bg-background flex flex-col gap-3 rounded-lg border px-3 py-3",
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Você foi indicado por
          </p>
          <p className="font-medium">{name}</p>
          <p className="text-muted-foreground text-xs">
            Representante Oficial ClubePeças
          </p>
          <p className="text-muted-foreground mt-2 text-xs font-medium tracking-wide uppercase">
            Código
          </p>
          <p className="font-mono text-sm">{representativeCode}</p>
        </div>
      </div>
      {onChangeCode ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={onChangeCode}
        >
          Trocar código
        </Button>
      ) : null}
    </div>
  );
}

export { IndicatedByRepresentativeCard };
