"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Store, Truck } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { storePath } from "@/constants/routes";
import { AnalyticsEventType } from "@/contracts/analytics/enums";
import { ContactSellerDialog } from "@/features/marketplace/components/ContactSellerDialog";
import { trackAnalyticsEvent } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";
import type { Seller } from "@/types/Seller";
import {
  buildAdvertisementWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/utils/whatsapp";

type SellerContactCardProps = {
  seller: Seller;
  advertisementTitle: string;
  /** Slug do anúncio — usado para analytics (WhatsApp click). */
  listingSlug?: string;
  className?: string;
};

/**
 * Card do vendedor com contato via WhatsApp e link para a loja.
 */
function SellerContactCard({
  seller,
  advertisementTitle,
  listingSlug,
  className,
}: SellerContactCardProps) {
  const {
    id,
    name,
    city,
    advertisementCount,
    avatarUrl,
    slug,
    whatsApp,
    offersLocalDelivery,
  } = seller;
  const [dialogOpen, setDialogOpen] = useState(false);
  const adsLabel =
    advertisementCount === 1 ? "1 anúncio" : `${advertisementCount} anúncios`;

  const canContact = Boolean(whatsApp?.trim());

  const trackWhatsApp = () => {
    if (listingSlug?.trim()) {
      trackAnalyticsEvent({
        eventType: AnalyticsEventType.ListingWhatsappClicked,
        listingSlug: listingSlug.trim(),
      });
    }
  };

  const handleContact = () => {
    if (!whatsApp?.trim()) return;

    if (offersLocalDelivery) {
      setDialogOpen(true);
      return;
    }

    const href = buildWhatsAppUrl(
      whatsApp,
      buildAdvertisementWhatsAppMessage(
        advertisementTitle,
        window.location.href,
      ),
    );

    if (!href) return;

    trackWhatsApp();
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Card className={cn("shadow-sm", className)}>
        <CardHeader>
          <CardTitle className="text-h3">Vendedor</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-center gap-3.5">
            <div className="bg-secondary text-store flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- avatar remoto do vendedor
                <img
                  src={avatarUrl}
                  alt={`Logo de ${name}`}
                  className="size-full object-cover"
                />
              ) : (
                <Store className="size-6" aria-hidden />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-h3 truncate">{name}</h3>
              <p className="text-small">{city}</p>
              <p className="text-small text-muted-foreground">{adsLabel}</p>
              {offersLocalDelivery ? (
                <p className="text-primary mt-1 flex items-center gap-1 text-xs font-medium">
                  <Truck className="size-3.5 shrink-0" aria-hidden />
                  Oferece Frete Local
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="whatsapp"
              className="flex-1"
              disabled={!canContact}
              title={
                canContact
                  ? "Abrir conversa no WhatsApp"
                  : "Este vendedor não informou WhatsApp"
              }
              onClick={handleContact}
            >
              <MessageCircle aria-hidden />
              Entrar em contato
            </Button>
            <Link
              href={storePath(slug)}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "flex-1 justify-center",
              )}
            >
              <Store aria-hidden className="text-store" />
              Ver loja
            </Link>
          </div>
        </CardContent>
      </Card>

      {whatsApp?.trim() && offersLocalDelivery ? (
        <ContactSellerDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          sellerId={id}
          sellerSlug={slug}
          sellerWhatsApp={whatsApp}
          advertisementTitle={advertisementTitle}
          onBeforeOpenWhatsApp={trackWhatsApp}
        />
      ) : null}
    </>
  );
}

export { SellerContactCard };
export type { SellerContactCardProps };
