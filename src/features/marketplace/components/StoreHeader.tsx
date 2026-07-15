import Image from "next/image";
import { Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Seller } from "@/types/Seller";

type StoreHeaderProps = {
  seller: Seller;
  className?: string;
};

/**
 * Cabeçalho público da loja — CTAs apenas visuais.
 */
function StoreHeader({ seller, className }: StoreHeaderProps) {
  const { name, city, state, advertisementCount, avatarUrl } = seller;
  const adsLabel =
    advertisementCount === 1 ? "1 anúncio" : `${advertisementCount} anúncios`;

  return (
    <header
      className={cn(
        "bg-surface border-border flex flex-col gap-5 rounded-xl border p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-6",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-4 sm:items-center">
        <div className="bg-muted text-muted-foreground relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl sm:size-20">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`Logo de ${name}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <Store className="size-8" aria-hidden />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-h1">{name}</h1>
          <p className="text-small mt-1">
            {city}, {state}
          </p>
          <p className="text-small text-muted-foreground mt-0.5">{adsLabel}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:shrink-0 sm:flex-row">
        <Button type="button" variant="primary">
          Entrar em contato
        </Button>
        <Button type="button" variant="outline">
          Compartilhar loja
        </Button>
      </div>
    </header>
  );
}

export { StoreHeader };
export type { StoreHeaderProps };
