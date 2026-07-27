"use client";

import { Loader2 } from "lucide-react";

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

type CancelPartRequestDialogProps = {
  open: boolean;
  requestTitle?: string;
  isCancelling?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

function CancelPartRequestDialog({
  open,
  requestTitle,
  isCancelling = false,
  onOpenChange,
  onConfirm,
}: CancelPartRequestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar solicitação?</DialogTitle>
          <DialogDescription>
            {requestTitle
              ? `Tem certeza que deseja cancelar “${requestTitle}”? Esta ação não pode ser desfeita.`
              : "Tem certeza que deseja cancelar esta solicitação? Esta ação não pode ser desfeita."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={isCancelling} />
            }
          >
            Voltar
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={isCancelling}
            onClick={onConfirm}
          >
            {isCancelling ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Cancelando…
              </>
            ) : (
              "Cancelar solicitação"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { CancelPartRequestDialog };
