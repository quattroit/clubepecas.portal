"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, MessageCircle, Share2, Store } from "lucide-react";
import { toast } from "sonner";

import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { Button, buttonVariants } from "@/components/ui/button";
import { APP_NAME } from "@/constants/app";
import { storePath } from "@/constants/routes";
import { AnalyticsEventType } from "@/contracts/analytics/enums";
import { trackAnalyticsEvent } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";
import type { Seller } from "@/types/Seller";
import {
  buildInstagramUrl,
  formatInstagramHandle,
} from "@/utils/instagram";
import { shareOrCopyUrl, toAbsoluteUrl } from "@/utils/share";
import {
  buildStoreWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/utils/whatsapp";

type StoreHeaderProps = {
  seller: Seller;
  className?: string;
};

/**
 * Cabeçalho público da loja — contato via WhatsApp/Instagram quando disponível.
 */
function StoreHeader({ seller, className }: StoreHeaderProps) {
  const {
    name,
    city,
    state,
    advertisementCount,
    avatarUrl,
    slug,
    whatsApp,
    instagram,
  } = seller;
  const [isSharing, setIsSharing] = useState(false);
  const adsLabel =
    advertisementCount === 1 ? "1 anúncio" : `${advertisementCount} anúncios`;

  const contactHref = whatsApp?.trim()
    ? buildWhatsAppUrl(whatsApp, buildStoreWhatsAppMessage())
    : null;
  const instagramHref = instagram?.trim()
    ? buildInstagramUrl(instagram)
    : null;
  const instagramLabel = instagram?.trim()
    ? formatInstagramHandle(instagram)
    : null;

  async function handleShareStore() {
    if (!slug || isSharing) return;

    setIsSharing(true);
    try {
      const url = toAbsoluteUrl(storePath(slug));
      const result = await shareOrCopyUrl({
        url,
        title: `${name} | ${APP_NAME}`,
        text: `Confira a loja ${name} no ${APP_NAME}`,
      });

      trackAnalyticsEvent({
        eventType: AnalyticsEventType.StoreShared,
        storeSlug: slug,
      });

      if (result === "copied") {
        toast.success("Link da loja copiado");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      toast.error("Não foi possível compartilhar a loja");
    } finally {
      setIsSharing(false);
    }
  }

  function handleStoreWhatsAppClick() {
    if (!slug) return;
    trackAnalyticsEvent({
      eventType: AnalyticsEventType.StoreWhatsappClicked,
      storeSlug: slug,
    });
  }

  return (
    <header
      className={cn(
        "bg-surface border-border flex flex-col gap-5 rounded-xl border p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-4 sm:items-center">
        <div className="bg-secondary text-store relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl sm:size-20">
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
          <p className="text-small mt-1.5 flex items-center gap-1.5">
            <MapPin className="text-location size-3.5 shrink-0" aria-hidden />
            {city}, {state}
          </p>
          <p className="text-small text-muted-foreground mt-1">{adsLabel}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:shrink-0 sm:flex-row sm:flex-wrap">
        {contactHref ? (
          <a
            href={contactHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "whatsapp" }))}
            aria-label={`Abrir WhatsApp de ${name}`}
            onClick={handleStoreWhatsAppClick}
          >
            <MessageCircle aria-hidden />
            Entrar em contato
          </a>
        ) : (
          <Button
            type="button"
            variant="whatsapp"
            disabled
            title="Esta loja não informou WhatsApp"
          >
            <MessageCircle aria-hidden />
            Entrar em contato
          </Button>
        )}
        {instagramHref && instagramLabel ? (
          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "instagram" }))}
            aria-label={`Abrir Instagram de ${name}`}
          >
            <InstagramIcon />
            {instagramLabel}
          </a>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="text-share"
          disabled={isSharing || !slug}
          aria-busy={isSharing}
          onClick={() => {
            void handleShareStore();
          }}
        >
          <Share2 aria-hidden />
          Compartilhar loja
        </Button>
      </div>
    </header>
  );
}

export { StoreHeader };
export type { StoreHeaderProps };
