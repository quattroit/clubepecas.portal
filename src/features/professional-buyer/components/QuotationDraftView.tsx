"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Minus, Plus, Receipt, Store, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { buttonVariants, Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES, advertisementPath } from "@/constants/routes";
import type { QuotationDraftItem } from "@/components/providers/QuotationDraftProvider";
import { useQuotationDraft } from "@/components/providers/QuotationDraftProvider";
import { useCreateQuotation } from "@/hooks/api/useCreateQuotation";
import { cn } from "@/lib/utils";
import {
  buildQuotationWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/utils/whatsapp";

function QuotationDraftItemRow({
  item,
  onRemove,
  onQuantityChange,
  onNotesChange,
}: {
  item: QuotationDraftItem;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
  onNotesChange: (notes: string) => void;
}) {
  return (
    <div className="border-border flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-start">
      <div className="bg-secondary flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        {item.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- miniatura remota do anúncio
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="size-full object-cover"
          />
        ) : (
          <Receipt className="text-muted-foreground size-6" aria-hidden />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={advertisementPath(item.slug)}
              className="text-small hover:text-primary line-clamp-2 font-medium"
            >
              {item.title}
            </Link>
            <p className="text-muted-foreground text-xs">
              Código: {item.advertisementId}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Remover ${item.title} da cotação`}
            onClick={onRemove}
          >
            <Trash2 className="text-destructive size-4" aria-hidden />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Diminuir quantidade"
            disabled={item.quantity <= 1}
            onClick={() => onQuantityChange(item.quantity - 1)}
          >
            <Minus className="size-3.5" aria-hidden />
          </Button>
          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Aumentar quantidade"
            onClick={() => onQuantityChange(item.quantity + 1)}
          >
            <Plus className="size-3.5" aria-hidden />
          </Button>
        </div>

        <Textarea
          value={item.itemNotes ?? ""}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Observação sobre este item (opcional)"
          className="min-h-16 text-sm"
        />
      </div>
    </div>
  );
}

function openWhatsAppTab(
  whatsAppUrl: string,
  pendingWindow: Window | null,
): void {
  if (pendingWindow && !pendingWindow.closed) {
    pendingWindow.location.replace(whatsAppUrl);
    return;
  }

  const opened = window.open(whatsAppUrl, "_blank");
  if (!opened) {
    const link = document.createElement("a");
    link.href = whatsAppUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

/**
 * Minha Cotação — rascunho local agrupado por vendedor, antes do envio.
 * Não é carrinho/checkout: cada grupo é enviado como uma solicitação de cotação.
 */
function QuotationDraftView() {
  const {
    items,
    groupBySeller,
    removeItem,
    updateQuantity,
    updateItemNotes,
    clearSellerGroup,
  } = useQuotationDraft();
  const createQuotation = useCreateQuotation();

  const [generalNotesBySeller, setGeneralNotesBySeller] = useState<
    Record<number, string>
  >({});
  const [sendingSellerId, setSendingSellerId] = useState<number | null>(null);

  const groups = groupBySeller();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Sua cotação está vazia"
        description="Navegue pelos anúncios e adicione peças para solicitar uma cotação ao vendedor."
        icon={<Receipt aria-hidden />}
        action={
          <Link
            href={ROUTES.ADVERTISEMENTS}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Explorar anúncios
          </Link>
        }
      />
    );
  }

  const handleSend = (sellerId: number) => {
    const group = groups.find((item) => item.sellerId === sellerId);
    if (!group) return;

    const generalNotes = generalNotesBySeller[sellerId]?.trim() || undefined;
    const payloadItems = group.items.map((item) => ({
      advertisementId: item.advertisementId,
      quantity: item.quantity,
      itemNotes: item.itemNotes?.trim() || undefined,
    }));

    // Abre no gesto do usuário para evitar bloqueio de pop-up após o POST.
    const whatsAppWindow = window.open("about:blank", "_blank");
    if (whatsAppWindow) {
      try {
        whatsAppWindow.document.write(
          "<!doctype html><title>WhatsApp</title><p style='font-family:sans-serif;padding:24px'>Abrindo conversa no WhatsApp…</p>",
        );
        whatsAppWindow.document.close();
      } catch {
        // Cross-origin / browser restrictions — segue com location.replace depois.
      }
    }

    setSendingSellerId(sellerId);
    createQuotation.mutate(
      {
        sellerId,
        generalNotes,
        items: payloadItems,
      },
      {
        onSuccess: (response) => {
          const message = buildQuotationWhatsAppMessage({
            storeName: group.storeName,
            quotationNumber: response.number,
            items: group.items,
            generalNotes: generalNotes ?? response.generalNotes,
            origin: window.location.origin,
          });

          const phone =
            response.sellerWhatsApp?.trim() ||
            group.sellerWhatsApp?.trim() ||
            "";

          const whatsAppUrl =
            response.whatsAppUrl?.trim() ||
            (phone ? buildWhatsAppUrl(phone, message) : null);

          if (whatsAppUrl) {
            openWhatsAppTab(whatsAppUrl, whatsAppWindow);
          } else {
            whatsAppWindow?.close();
            toast.warning(
              "Solicitação enviada, mas o vendedor não possui WhatsApp cadastrado.",
            );
          }

          clearSellerGroup(sellerId);
          setGeneralNotesBySeller((current) => {
            const next = { ...current };
            delete next[sellerId];
            return next;
          });
        },
        onError: () => {
          whatsAppWindow?.close();
        },
        onSettled: () => setSendingSellerId(null),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <Card key={group.sellerId}>
          <CardHeader className="border-border flex-row items-center justify-between border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="text-store size-4" aria-hidden />
              {group.storeName}
            </CardTitle>
            <span className="text-muted-foreground text-xs">
              {group.itemCount === 1 ? "1 item" : `${group.itemCount} itens`}
            </span>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 pt-4">
            <div className="flex flex-col gap-3">
              {group.items.map((item) => (
                <QuotationDraftItemRow
                  key={item.advertisementId}
                  item={item}
                  onRemove={() => removeItem(item.advertisementId)}
                  onQuantityChange={(quantity) =>
                    updateQuantity(item.advertisementId, quantity)
                  }
                  onNotesChange={(notes) =>
                    updateItemNotes(item.advertisementId, notes)
                  }
                />
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`general-notes-${group.sellerId}`}
                className="text-sm font-medium"
              >
                Observações gerais para {group.storeName}
              </label>
              <Textarea
                id={`general-notes-${group.sellerId}`}
                value={generalNotesBySeller[group.sellerId] ?? ""}
                onChange={(event) =>
                  setGeneralNotesBySeller((current) => ({
                    ...current,
                    [group.sellerId]: event.target.value,
                  }))
                }
                placeholder="Ex.: preciso com urgência, aceito peça usada, etc."
              />
            </div>

            <div className="flex flex-col items-stretch gap-2 sm:items-end">
              <Button
                type="button"
                onClick={() => handleSend(group.sellerId)}
                disabled={
                  createQuotation.isPending && sendingSellerId === group.sellerId
                }
                className="gap-2"
              >
                <MessageCircle className="size-4" aria-hidden />
                {createQuotation.isPending && sendingSellerId === group.sellerId
                  ? "Enviando…"
                  : "Enviar e falar no WhatsApp"}
              </Button>
              <p className="text-muted-foreground text-xs sm:text-right">
                A solicitação é registrada na plataforma e a conversa abre no
                WhatsApp do vendedor.
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export { QuotationDraftView };
