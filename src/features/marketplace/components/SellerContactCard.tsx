"use client";

import Link from "next/link";
import { Store } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { storePath } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Seller } from "@/types/Seller";
import {
  buildAdvertisementWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/utils/whatsapp";

type SellerContactCardProps = {
  seller: Seller;
  advertisementTitle: string;
  className?: string;
};

/**
 * Card do vendedor com contato via WhatsApp e link para a loja.
 */
function SellerContactCard({
  seller,
  advertisementTitle,
  className,
}: SellerContactCardProps) {
  const { name, city, advertisementCount, avatarUrl, slug, whatsApp } = seller;
  const adsLabel =
    advertisementCount === 1 ? "1 anúncio" : `${advertisementCount} anúncios`;

  const canContact = Boolean(whatsApp?.trim());

  const handleContact = () => {
    if (!whatsApp?.trim()) return;

    const href = buildWhatsAppUrl(
      whatsApp,
      buildAdvertisementWhatsAppMessage(
        advertisementTitle,
        window.location.href,
      ),
    );

    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card className={cn("shadow-xs", className)}>
      <CardHeader>
        <CardTitle>Vendedor</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg">
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
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            disabled={!canContact}
            title={
              canContact
                ? "Abrir conversa no WhatsApp"
                : "Este vendedor não informou WhatsApp"
            }
            onClick={handleContact}
          >
            Entrar em contato
          </Button>
          <Link
            href={storePath(slug)}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex-1 justify-center",
            )}
          >
            Ver loja
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export { SellerContactCard };
export type { SellerContactCardProps };
