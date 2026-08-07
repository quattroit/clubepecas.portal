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
import { useViaCepLookup } from "@/hooks/api/useViaCepLookup";
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

function formatDeliveryAddress(parts: {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}): string {
  const streetLine = [parts.street.trim(), parts.number.trim()]
    .filter(Boolean)
    .join(", ");
  const placeLine = [parts.neighborhood.trim(), `${parts.city.trim()}/${parts.state.trim()}`]
    .filter((part) => part && part !== "/")
    .join(" — ");
  const cep = parts.zipCode.length === 8 ? formatPostalCodeInput(parts.zipCode) : "";

  return [streetLine, placeLine, cep ? `CEP ${cep}` : ""]
    .filter(Boolean)
    .join(", ");
}

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
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [number, setNumber] = useState("");
  const [editingZip, setEditingZip] = useState(false);
  const [estimate, setEstimate] = useState<EstimateLocalDeliveryResponse | null>(
    null,
  );

  const registeredZip = useMemo(() => {
    if (!isProfessionalBuyer) return "";
    return normalizePostalCode(pbQuery.data?.zipCode ?? "");
  }, [isProfessionalBuyer, pbQuery.data?.zipCode]);

  const zipDigits = normalizePostalCode(zipCode);
  const viaCepEnabled =
    open && mode === "local_delivery" && isValidPostalCode(zipDigits);
  const viaCepQuery = useViaCepLookup(zipCode, viaCepEnabled);

  useEffect(() => {
    if (!open) return;

    setMode("pickup");
    setEstimate(null);
    setEditingZip(false);
    setStreet("");
    setNeighborhood("");
    setCity("");
    setState("");
    setNumber("");
    estimateMutation.reset();

    if (isProfessionalBuyer && registeredZip.length === 8) {
      setZipCode(formatPostalCodeInput(registeredZip));
    } else {
      const guest = loadGuestDeliveryZipCode();
      setZipCode(guest ? formatPostalCodeInput(guest) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when dialog opens / CEP cadastrado chega
  }, [open, isProfessionalBuyer, registeredZip]);

  // Prefill do comprador profissional quando o perfil carregar (mesmo CEP cadastrado).
  useEffect(() => {
    if (!open || !isProfessionalBuyer || !pbQuery.data) return;
    if (normalizePostalCode(zipCode) !== registeredZip || registeredZip.length !== 8) {
      return;
    }

    const pb = pbQuery.data;
    setStreet((current) => current.trim() || pb.address?.trim() || "");
    setNeighborhood(
      (current) => current.trim() || pb.neighborhood?.trim() || "",
    );
    setCity((current) => current.trim() || pb.city?.trim() || "");
    setState((current) => current.trim() || pb.state?.trim() || "");
    setNumber((current) => current.trim() || pb.number?.trim() || "");
  }, [
    open,
    isProfessionalBuyer,
    pbQuery.data,
    registeredZip,
    zipCode,
  ]);

  useEffect(() => {
    const lookup = viaCepQuery.data;
    if (!lookup || !viaCepEnabled) return;

    // Prefill from ViaCEP; keep valores já preenchidos (ex.: cadastro PB).
    setStreet((current) => current.trim() || lookup.street);
    setNeighborhood((current) => current.trim() || lookup.neighborhood);
    setCity((current) => current.trim() || lookup.city);
    setState((current) => current.trim() || lookup.state);
  }, [viaCepQuery.data, viaCepEnabled]);

  useEffect(() => {
    setEstimate(null);
  }, [zipDigits, street, neighborhood, city, state, number]);

  const hasAddressBase =
    street.trim().length > 0 &&
    city.trim().length > 0 &&
    state.trim().length > 0;
  const canEstimate =
    isValidPostalCode(zipDigits) &&
    hasAddressBase &&
    number.trim().length > 0 &&
    !viaCepQuery.isFetching;

  function handleZipChange(value: string) {
    setZipCode(formatPostalCodeInput(value));
    setStreet("");
    setNeighborhood("");
    setCity("");
    setState("");
    setEstimate(null);
  }

  function handleEstimate() {
    if (!canEstimate || estimateMutation.isPending) return;
    saveGuestDeliveryZipCode(zipDigits);
    estimateMutation.mutate(
      {
        sellerId: sellerId && sellerId > 0 ? sellerId : null,
        sellerSlug: sellerSlug?.trim() || null,
        deliveryZipCode: zipDigits,
        deliveryStreet: street.trim(),
        deliveryNumber: number.trim(),
        deliveryNeighborhood: neighborhood.trim() || null,
        deliveryCity: city.trim(),
        deliveryState: state.trim(),
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

    const deliveryAddress =
      hasAddressBase && number.trim()
        ? formatDeliveryAddress({
            street,
            number,
            neighborhood,
            city,
            state,
            zipCode: zipDigits,
          })
        : undefined;

    return {
      receiptMode: "local_delivery",
      deliveryZipCode: zipDigits.length === 8 ? zipDigits : undefined,
      deliveryAddress,
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

  const addressReady =
    viaCepQuery.isSuccess && viaCepQuery.data != null
      ? true
      : hasAddressBase;

  const canContinueWhatsApp =
    mode === "pickup" ||
    (isValidPostalCode(zipDigits) &&
      hasAddressBase &&
      number.trim().length > 0);

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
                Informe o CEP e o número para uma estimativa mais precisa —
                valor sujeito a confirmação.
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
                  onChange={(event) => handleZipChange(event.target.value)}
                />
              </div>
            )}

            {viaCepQuery.isFetching ? (
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Buscando endereço…
              </p>
            ) : null}

            {viaCepQuery.isError ||
            (viaCepEnabled &&
              viaCepQuery.isFetched &&
              viaCepQuery.data === null &&
              !hasAddressBase) ? (
              <p className="text-destructive text-sm" role="alert">
                Não encontramos o endereço deste CEP. Confira o número
                informado.
              </p>
            ) : null}

            {addressReady && isValidPostalCode(zipDigits) ? (
              <div className="border-border bg-secondary/40 flex flex-col gap-3 rounded-lg border px-3 py-3">
                {street.trim() ? (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Rua: </span>
                    {street}
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="delivery-street">Rua</Label>
                    <Input
                      id="delivery-street"
                      autoComplete="address-line1"
                      placeholder="Nome da rua"
                      value={street}
                      onChange={(event) => setStreet(event.target.value)}
                    />
                  </div>
                )}

                {neighborhood.trim() ? (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Bairro: </span>
                    {neighborhood}
                  </p>
                ) : null}

                {city.trim() && state.trim() ? (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Cidade: </span>
                    {city}/{state}
                  </p>
                ) : null}

                <div className="flex flex-col gap-2">
                  <Label htmlFor="delivery-number">Número</Label>
                  <Input
                    id="delivery-number"
                    inputMode="text"
                    autoComplete="address-line2"
                    placeholder="Ex.: 123"
                    value={number}
                    onChange={(event) => setNumber(event.target.value)}
                  />
                  <p className="text-muted-foreground text-xs">
                    Informe o número para o frete ficar mais preciso.
                  </p>
                </div>
              </div>
            ) : null}

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
          <Button
            type="button"
            variant="whatsapp"
            disabled={!canContinueWhatsApp}
            onClick={handleWhatsApp}
          >
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
