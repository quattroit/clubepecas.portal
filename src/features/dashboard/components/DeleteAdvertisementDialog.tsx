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

type DeleteAdvertisementDialogProps = {
  open: boolean;
  advertisementTitle?: string;
  isDeleting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

function DeleteAdvertisementDialog({
  open,
  advertisementTitle,
  isDeleting = false,
  onOpenChange,
  onConfirm,
}: DeleteAdvertisementDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir anúncio?</DialogTitle>
          <DialogDescription>
            {advertisementTitle
              ? `Tem certeza que deseja excluir “${advertisementTitle}”? Esta ação não pode ser desfeita.`
              : "Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={isDeleting} />
            }
          >
            Cancelar
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Excluindo…
              </>
            ) : (
              "Excluir"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteAdvertisementDialog };
export type { DeleteAdvertisementDialogProps };
