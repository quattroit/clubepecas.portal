"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PartRequestOutcome } from "@/contracts/common/enums";
import type { PartRequestSupplierDto } from "@/contracts/part-requests";
import { cn } from "@/lib/utils";

type Step = "ask" | "found" | "notFound";

type CompletePartRequestDialogProps = {
  open: boolean;
  requestTitle?: string;
  selectedSuppliers: PartRequestSupplierDto[];
  isCompleting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: {
    outcome: PartRequestOutcome.Found | PartRequestOutcome.NotFound;
    winningSellerId?: number;
    closingNotes?: string;
  }) => void;
};

function CompletePartRequestDialog({
  open,
  requestTitle,
  selectedSuppliers,
  isCompleting = false,
  onOpenChange,
  onConfirm,
}: CompletePartRequestDialogProps) {
  const [step, setStep] = useState<Step>("ask");
  const [winningSellerId, setWinningSellerId] = useState<number | null>(null);
  const [closingNotes, setClosingNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setStep("ask");
    setWinningSellerId(null);
    setClosingNotes("");
  }, [open]);

  const canSubmitFound = winningSellerId != null && winningSellerId > 0;
  const sortedSuppliers = useMemo(
    () =>
      [...selectedSuppliers].sort(
        (a, b) => a.displayOrder - b.displayOrder || a.storeName.localeCompare(b.storeName),
      ),
    [selectedSuppliers],
  );

  const handleSubmitFound = () => {
    if (!canSubmitFound || winningSellerId == null) return;
    onConfirm({
      outcome: PartRequestOutcome.Found,
      winningSellerId,
      closingNotes: closingNotes.trim() || undefined,
    });
  };

  const handleSubmitNotFound = () => {
    onConfirm({
      outcome: PartRequestOutcome.NotFound,
      closingNotes: closingNotes.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {step === "ask" ? (
          <>
            <DialogHeader>
              <DialogTitle>Finalizar solicitação</DialogTitle>
              <DialogDescription>
                {requestTitle
                  ? `Você encontrou a peça para “${requestTitle}”?`
                  : "Você encontrou a peça?"}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-between">
              <DialogClose
                render={
                  <Button type="button" variant="outline" disabled={isCompleting} />
                }
              >
                Voltar
              </DialogClose>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isCompleting}
                  onClick={() => setStep("notFound")}
                >
                  Não
                </Button>
                <Button
                  type="button"
                  disabled={isCompleting}
                  onClick={() => setStep("found")}
                >
                  Sim
                </Button>
              </div>
            </DialogFooter>
          </>
        ) : null}

        {step === "found" ? (
          <>
            <DialogHeader>
              <DialogTitle>Peça encontrada</DialogTitle>
              <DialogDescription>
                Selecione o fornecedor com quem a peça foi encontrada.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              {sortedSuppliers.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhum fornecedor selecionado nesta solicitação. Selecione
                  fornecedores antes de concluir como encontrada.
                </p>
              ) : (
                <fieldset className="flex flex-col gap-2">
                  <legend className="text-sm font-medium">Fornecedor</legend>
                  <ul className="flex max-h-48 flex-col gap-2 overflow-y-auto">
                    {sortedSuppliers.map((supplier) => {
                      const selected = winningSellerId === supplier.sellerId;
                      return (
                        <li key={supplier.sellerId}>
                          <button
                            type="button"
                            onClick={() => setWinningSellerId(supplier.sellerId)}
                            className={cn(
                              "border-border flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                              selected
                                ? "border-primary bg-primary/5"
                                : "hover:bg-muted/60",
                            )}
                          >
                            <span
                              className={cn(
                                "flex size-5 shrink-0 items-center justify-center rounded-full border",
                                selected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border",
                              )}
                              aria-hidden
                            >
                              {selected ? (
                                <CheckCircle2 className="size-3.5" />
                              ) : null}
                            </span>
                            <span className="min-w-0">
                              <span className="block font-medium">
                                {supplier.storeName}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {supplier.cityName}/{supplier.cityState}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="complete-notes-found">Observações (opcional)</Label>
                <textarea
                  id="complete-notes-found"
                  value={closingNotes}
                  onChange={(event) => setClosingNotes(event.target.value)}
                  rows={3}
                  maxLength={2000}
                  className={cn(
                    "border-input bg-surface text-foreground w-full rounded-xl border px-3 py-2 text-sm outline-none",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
                  )}
                  placeholder="Alguma observação sobre o atendimento…"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isCompleting}
                onClick={() => setStep("ask")}
              >
                Voltar
              </Button>
              <Button
                type="button"
                disabled={isCompleting || !canSubmitFound}
                onClick={handleSubmitFound}
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Concluindo…
                  </>
                ) : (
                  "Concluir"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : null}

        {step === "notFound" ? (
          <>
            <DialogHeader>
              <DialogTitle>Peça não encontrada</DialogTitle>
              <DialogDescription>
                Confirme o encerramento sem fornecedor vencedor.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="complete-notes-not-found">
                Observações (opcional)
              </Label>
              <textarea
                id="complete-notes-not-found"
                value={closingNotes}
                onChange={(event) => setClosingNotes(event.target.value)}
                rows={3}
                maxLength={2000}
                className={cn(
                  "border-input bg-surface text-foreground w-full rounded-xl border px-3 py-2 text-sm outline-none",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
                )}
                placeholder="Alguma observação sobre a busca…"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isCompleting}
                onClick={() => setStep("ask")}
              >
                Voltar
              </Button>
              <Button
                type="button"
                disabled={isCompleting}
                onClick={handleSubmitNotFound}
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Concluindo…
                  </>
                ) : (
                  "Concluir"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export { CompletePartRequestDialog };
