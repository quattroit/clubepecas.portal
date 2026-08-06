"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  LOCAL_DELIVERY_RADIUS_OPTIONS_KM,
  type LocalDeliveryTierDto,
} from "@/contracts/local-delivery";
import { LocalDeliveryPricingMode } from "@/contracts/common/enums";
import { useSellerLocalDelivery } from "@/hooks/api/useSellerLocalDelivery";
import { useUpdateSellerLocalDelivery } from "@/hooks/api/useUpdateSellerLocalDelivery";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 w-full rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

type TierDraft = {
  maxDistanceKm: string;
  price: string;
};

function SellerLocalDeliverySettingsCard() {
  const query = useSellerLocalDelivery();
  const mutation = useUpdateSellerLocalDelivery();

  const [isEnabled, setIsEnabled] = useState(false);
  const [maxRadiusKm, setMaxRadiusKm] = useState(30);
  const [pricingMode, setPricingMode] = useState(
    LocalDeliveryPricingMode.FixedPlusPerKm,
  );
  const [fixedFee, setFixedFee] = useState("15");
  const [pricePerKm, setPricePerKm] = useState("1.80");
  const [tiers, setTiers] = useState<TierDraft[]>([
    { maxDistanceKm: "10", price: "25" },
    { maxDistanceKm: "30", price: "45" },
  ]);

  useEffect(() => {
    if (!query.data) return;
    setIsEnabled(query.data.isEnabled);
    setMaxRadiusKm(query.data.maxRadiusKm || 30);
    setPricingMode(query.data.pricingMode);
    setFixedFee(
      query.data.fixedFee != null ? String(query.data.fixedFee) : "15",
    );
    setPricePerKm(
      query.data.pricePerKm != null ? String(query.data.pricePerKm) : "1.80",
    );
    if (query.data.tiers.length > 0) {
      setTiers(
        query.data.tiers.map((tier) => ({
          maxDistanceKm: String(tier.maxDistanceKm),
          price: String(tier.price),
        })),
      );
    }
  }, [query.data]);

  const hasCompleteAddress = query.data?.hasCompleteAddress ?? false;

  function parseMoney(value: string): number {
    return Number(value.replace(",", "."));
  }

  function handleSave() {
    if (mutation.isPending) return;

    const tiersPayload: LocalDeliveryTierDto[] =
      pricingMode === LocalDeliveryPricingMode.DistanceTiers
        ? tiers.map((tier) => ({
            maxDistanceKm: Number(tier.maxDistanceKm),
            price: parseMoney(tier.price),
          }))
        : [];

    mutation.mutate({
      isEnabled,
      maxRadiusKm,
      pricingMode,
      fixedFee:
        pricingMode === LocalDeliveryPricingMode.FixedPlusPerKm
          ? parseMoney(fixedFee)
          : null,
      pricePerKm:
        pricingMode === LocalDeliveryPricingMode.FixedPlusPerKm
          ? parseMoney(pricePerKm)
          : null,
      tiers: tiersPayload,
    });
  }

  if (query.isLoading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="text-muted-foreground flex items-center gap-2 py-8 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Carregando Frete Local…
        </CardContent>
      </Card>
    );
  }

  if (query.isError) {
    return (
      <ErrorMessage
        title="Não foi possível carregar o Frete Local"
        message={getFriendlyErrorMessage(query.error)}
      />
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-h3">Configuração</CardTitle>
        <p className="text-small text-muted-foreground">
          Ative a entrega própria, defina o raio e a forma de cálculo. O WhatsApp
          do cliente nunca fica bloqueado.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {!hasCompleteAddress ? (
          <p
            role="status"
            className="border-border bg-secondary text-secondary-foreground rounded-lg border px-4 py-3 text-sm"
          >
            Complete o endereço da loja (CEP, rua, número e bairro) para ativar
            o Frete Local.
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="local-delivery-enabled">Oferecer Frete Local</Label>
            <p className="text-muted-foreground text-xs">
              Aparece no contato do anúncio e da loja.
            </p>
          </div>
          <Switch
            id="local-delivery-enabled"
            checked={isEnabled}
            disabled={!hasCompleteAddress && !isEnabled}
            onCheckedChange={(checked) => setIsEnabled(checked)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="local-delivery-radius">Raio máximo</Label>
          <select
            id="local-delivery-radius"
            className={selectClassName}
            value={maxRadiusKm}
            disabled={!isEnabled}
            onChange={(event) => setMaxRadiusKm(Number(event.target.value))}
          >
            {LOCAL_DELIVERY_RADIUS_OPTIONS_KM.map((km) => (
              <option key={km} value={km}>
                {km} km
              </option>
            ))}
          </select>
        </div>

        <fieldset className="flex flex-col gap-3" disabled={!isEnabled}>
          <legend className="text-sm font-medium">Forma de cálculo</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="pricing-mode"
              checked={
                pricingMode === LocalDeliveryPricingMode.FixedPlusPerKm
              }
              onChange={() =>
                setPricingMode(LocalDeliveryPricingMode.FixedPlusPerKm)
              }
            />
            Taxa fixa + valor por km
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="pricing-mode"
              checked={pricingMode === LocalDeliveryPricingMode.DistanceTiers}
              onChange={() =>
                setPricingMode(LocalDeliveryPricingMode.DistanceTiers)
              }
            />
            Tabela por faixas de distância
          </label>
        </fieldset>

        {isEnabled &&
        pricingMode === LocalDeliveryPricingMode.FixedPlusPerKm ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="local-delivery-fixed">Taxa fixa (R$)</Label>
              <Input
                id="local-delivery-fixed"
                inputMode="decimal"
                value={fixedFee}
                onChange={(event) => setFixedFee(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="local-delivery-per-km">Valor por km (R$)</Label>
              <Input
                id="local-delivery-per-km"
                inputMode="decimal"
                value={pricePerKm}
                onChange={(event) => setPricePerKm(event.target.value)}
              />
            </div>
          </div>
        ) : null}

        {isEnabled &&
        pricingMode === LocalDeliveryPricingMode.DistanceTiers ? (
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground text-xs">
              A última faixa deve cobrir pelo menos o raio máximo ({maxRadiusKm}{" "}
              km).
            </p>
            {tiers.map((tier, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_auto] items-end gap-2"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`tier-km-${index}`}>Até (km)</Label>
                  <Input
                    id={`tier-km-${index}`}
                    inputMode="numeric"
                    value={tier.maxDistanceKm}
                    onChange={(event) => {
                      const next = [...tiers];
                      next[index] = {
                        ...tier,
                        maxDistanceKm: event.target.value,
                      };
                      setTiers(next);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`tier-price-${index}`}>Preço (R$)</Label>
                  <Input
                    id={`tier-price-${index}`}
                    inputMode="decimal"
                    value={tier.price}
                    onChange={(event) => {
                      const next = [...tiers];
                      next[index] = { ...tier, price: event.target.value };
                      setTiers(next);
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={tiers.length <= 1}
                  aria-label="Remover faixa"
                  onClick={() =>
                    setTiers((current) =>
                      current.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="self-start"
              onClick={() =>
                setTiers((current) => [
                  ...current,
                  { maxDistanceKm: String(maxRadiusKm), price: "0" },
                ])
              }
            >
              <Plus className="size-4" aria-hidden />
              Adicionar faixa
            </Button>
          </div>
        ) : null}

        {mutation.isError ? (
          <ErrorMessage
            title="Não foi possível salvar"
            message={getFriendlyErrorMessage(mutation.error)}
          />
        ) : null}

        <Button
          type="button"
          disabled={mutation.isPending || (!hasCompleteAddress && isEnabled)}
          onClick={handleSave}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Salvando…
            </>
          ) : (
            "Salvar Frete Local"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export { SellerLocalDeliverySettingsCard };
