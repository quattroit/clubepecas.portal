"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { useReferral } from "@/components/providers/ReferralProvider";
import { cn } from "@/lib/utils";

type ActiveReferralBannerProps = {
  className?: string;
  /** Oculta quando o vendedor já tem vínculo definitivo (provider limpa, mas evita flash). */
  hidden?: boolean;
};

/**
 * Indicador discreto da indicação ativa (Sprint 10.4).
 */
function ActiveReferralBanner({ className, hidden }: ActiveReferralBannerProps) {
  const {
    isReady,
    hasActiveReferral,
    representativeCode,
    representativeName,
    clear,
  } = useReferral();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (hidden || !isReady || !hasActiveReferral || !representativeCode) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "border-border bg-muted/40 flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm",
          className,
        )}
      >
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Indicado por
          </p>
          <p className="truncate font-medium">
            {representativeName ?? "Representante"}
          </p>
          <p className="font-mono text-xs">{representativeCode}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setConfirmOpen(true)}
        >
          Remover indicação
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remover indicação?"
        description="A indicação temporária será removida deste navegador. Você poderá informar outro código no checkout."
        confirmLabel="Remover"
        confirmVariant="destructive"
        onConfirm={() => {
          clear();
          setConfirmOpen(false);
        }}
      />
    </>
  );
}

export { ActiveReferralBanner };
