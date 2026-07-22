"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";

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
import { getRepresentativePublicUrl } from "@/utils/representativePublicLink";

type RepresentativeQrCodeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  representativeCode: string;
  representativeName?: string;
};

function RepresentativeQrCodeDialog({
  open,
  onOpenChange,
  representativeCode,
  representativeName,
}: RepresentativeQrCodeDialogProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const publicUrl = getRepresentativePublicUrl(representativeCode);

  useEffect(() => {
    if (!open) {
      setDataUrl(null);
      return;
    }

    let cancelled = false;
    setIsGenerating(true);

    void QRCode.toDataURL(publicUrl, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) {
          setDataUrl(null);
          toast.error("Não foi possível gerar o QR Code.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsGenerating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, publicUrl]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = `clubepecas-${representativeCode.toLowerCase()}-qr.png`;
    anchor.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code de indicação</DialogTitle>
          <DialogDescription>
            {representativeName
              ? `Link público de ${representativeName} (${representativeCode}).`
              : `Link público ${representativeCode}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-2">
          {isGenerating ? (
            <div className="text-muted-foreground flex items-center gap-2 py-10 text-sm">
              <Loader2 className="size-4 animate-spin" />
              Gerando…
            </div>
          ) : dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dataUrl}
              alt={`QR Code ${representativeCode}`}
              className="size-64 rounded-lg border bg-white p-2"
            />
          ) : (
            <p className="text-destructive text-sm">Falha ao gerar QR Code.</p>
          )}
          <p className="text-muted-foreground max-w-full truncate text-center text-xs font-mono">
            {publicUrl}
          </p>
        </div>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Fechar
          </DialogClose>
          <Button
            type="button"
            variant="primary"
            disabled={!dataUrl}
            onClick={handleDownload}
          >
            <Download className="size-3.5" />
            Download PNG
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { RepresentativeQrCodeDialog };
