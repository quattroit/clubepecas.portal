"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/AuthProvider";
import { UserRole } from "@/contracts/common/enums";
import type { EstimateLocalDeliveryResponse } from "@/contracts/local-delivery";
import { useEstimateLocalDelivery } from "@/hooks/api/useEstimateLocalDelivery";
import { useMyProfessionalBuyer } from "@/hooks/api/useMyProfessionalBuyer";
import {
  loadGuestDeliveryZipCode,
  saveGuestDeliveryZipCode,
} from "@/lib/guest-delivery-zip";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  formatPostalCodeInput,
  isValidPostalCode,
  normalizePostalCode,
} from "@/utils/postalCode";
import {
  buildAdvertisementWhatsAppMessage,
  buildStoreWhatsAppMessage,
  buildWhatsAppUrl,
  type LocalDeliveryWhatsAppContext,
} from "@/utils/whatsapp";

export type ContactReceiptMode = "pickup" | "local_delivery";

type ContactSellerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sellerId?: number;
  sellerSlug?: string;
  sellerWhatsApp: string;
  /** Título do anúncio — se ausente, usa mensagem de loja. */
  advertisementTitle?: string;
  advertisementUrl?: string;
  onBeforeOpenWhatsApp?: () => void;
};

/**
 * Modal de recebimento antes do WhatsApp quando a loja oferece Frete Local.
 */
function ContactSellerDialog({
  open,
  onOpenChange,
  sellerId,
  sellerSlug,
  sellerWhatsApp,
  advertisementTitle,
  advertisementUrl,
  onBeforeOpenWhatsApp,
}: ContactSellerDialogProps) {
  const { user } = useAuth();
  const isProfessionalBuyer = user?.role === UserRole.ProfessionalBuyer;
  const pbQuery = useMyProfessionalBuyer(open && isProfessionalBuyer);
  const estimateMutation = useEstimateLocalDelivery();

  const [mode, setMode] = useState<ContactReceiptMode>("pickup");
  const [zipCode, setZipCode] = useState("");
  const [editingZip, setEditingZip] = useState(false);
  const [estimate, setEstimate] = useState<EstimateLocalDeliveryResponse | null>(
    null,
  );

  const registeredZip = useMemo(() => {
    if (!isProfessionalBuyer) return "";
    return normalizePostalCode(pbQuery.data?.zipCode ?? "");
  }, [isProfessionalBuyer, pbQuery.data?.zipCode]);

  useEffect(() => {
    if (!open) return;
    setMode("pickup");
    setEstimate(null);
    setEditingZip(false);
    estimateMutation.reset();

    if (isProfessionalBuyer && registeredZip.length === 8) {
      setZipCode(formatPostalCodeInput(registeredZip));
    } else {
      const guest = loadGuestDeliveryZipCode();
      setZipCode(guest ? formatPostalCodeInput(guest) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when dialog opens
  }, [open, isProfessionalBuyer, registeredZip]);

  const zipDigits = normalizePostalCode(zipCode);
  const canEstimate = isValidPostalCode(zipDigits);

  function handleEstimate() {
    if (!canEstimate || estimateMutation.isPending) return;
    saveGuestDeliveryZipCode(zipDigits);
    estimateMutation.mutate(
      {
        sellerId: sellerId && sellerId > 0 ? sellerId : null,
        sellerSlug: sellerSlug?.trim() || null,
        deliveryZipCode: zipDigits,
      },
      {
        onSuccess: (data) => setEstimate(data),
      },
    );
  }

  function buildDeliveryContext(): LocalDeliveryWhatsAppContext | undefined {
    if (mode === "pickup") {
      return { receiptMode: "pickup" };
    }

    return {
      receiptMode: "local_delivery",
      deliveryZipCode: zipDigits.length === 8 ? zipDigits : undefined,
      distanceKm: estimate?.distanceKm ?? undefined,
      estimatedPrice: estimate?.estimatedPrice ?? undefined,
      withinRadius: estimate?.withinRadius,
      maxRadiusKm: estimate?.maxRadiusKm ?? undefined,
    };
  }

  function handleWhatsApp() {
    if (!sellerWhatsApp.trim()) return;

    if (mode === "local_delivery" && zipDigits.length === 8) {
      saveGuestDeliveryZipCode(zipDigits);
    }

    const context = buildDeliveryContext();
    const message = advertisementTitle?.trim()
      ? buildAdvertisementWhatsAppMessage(
          advertisementTitle,
          advertisementUrl ??
            (typeof window !== "undefined" ? window.location.href : ""),
          context,
        )
      : buildStoreWhatsAppMessage(context);

    const href = buildWhatsAppUrl(sellerWhatsApp, message);
    if (!href) return;

    onBeforeOpenWhatsApp?.();
    window.open(href, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  }

  const showRegisteredZipHint =
    isProfessionalBuyer &&
    registeredZip.length === 8 &&
    !editingZip &&
    mode === "local_delivery";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Como deseja receber?</DialogTitle>
          <DialogDescription>
            Escolha a forma de recebimento. Você sempre poderá falar com o
            vendedor no WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">Forma de recebimento</legend>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="radio"
              name="receipt-mode"
              className="mt-1"
              checked={mode === "pickup"}
              onChange={() => {
                setMode("pickup");
                setEstimate(null);
              }}
            />
            <span>
              <span className="font-medium">Retirada na loja</span>
              <span className="text-muted-foreground block text-xs">
                Combinar horário e endereço diretamente com o vendedor.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="radio"
              name="receipt-mode"
              className="mt-1"
              checked={mode === "local_delivery"}
              onChange={() => setMode("local_delivery")}
            />
            <span>
              <span className="font-medium">Entrega local (motoboy)</span>
              <span className="text-muted-foreground block text-xs">
                Estimativa de frete com base no CEP — valor sujeito a
                confirmação.
              </span>
            </span>
          </label>
        </fieldset>

        {mode === "local_delivery" ? (
          <div className="flex flex-col gap-3">
            {showRegisteredZipHint ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm">
                  CEP cadastrado:{" "}
                  <span className="font-medium tabular-nums">
                    {formatPostalCodeInput(registeredZip)}
                  </span>
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={() => setEditingZip(true)}
                >
                  Alterar CEP
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label htmlFor="delivery-zip">CEP de entrega</Label>
                <Input
                  id="delivery-zip"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="00000-000"
                  value={zipCode}
                  onChange={(event) =>
                    setZipCode(formatPostalCodeInput(event.target.value))
                  }
                />
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              disabled={!canEstimate || estimateMutation.isPending}
              onClick={handleEstimate}
            >
              {estimateMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Calculando…
                </>
              ) : (
                "Calcular frete estimado"
              )}
            </Button>

            {estimateMutation.isError ? (
              <p className="text-destructive text-sm" role="alert">
                {getFriendlyErrorMessage(estimateMutation.error)} Você ainda
                pode falar no WhatsApp.
              </p>
            ) : null}

            {estimate ? (
              <div className="border-border bg-secondary/40 flex flex-col gap-2 rounded-lg border px-3 py-3 text-sm">
                {estimate.withinRadius && estimate.estimatedPrice != null ? (
                  <>
                    <p>
                      Distância aproximada:{" "}
                      <strong>
                        {estimate.distanceKm?.toLocaleString("pt-BR", {
                          maximumFractionDigits: 1,
                        })}{" "}
                        km
                      </strong>
                    </p>
                    <p>
                      Frete estimado:{" "}
                      <strong>
                        {formatCurrency(estimate.estimatedPrice)}
                      </strong>
                    </p>
                  </>
                ) : (
                  <p>{estimate.message}</p>
                )}
                {estimate.disclaimer ? (
                  <p className="text-muted-foreground text-xs">
                    {estimate.disclaimer}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="button" variant="whatsapp" onClick={handleWhatsApp}>
            <MessageCircle aria-hidden />
            Continuar no WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ContactSellerDialog };
export type { ContactSellerDialogProps };
