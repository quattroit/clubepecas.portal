import Link from "next/link";
import { MapPin, MessageCircle, Store } from "lucide-react";

import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { storePath } from "@/constants/routes";
import { AnalyticsEventType } from "@/contracts/analytics/enums";
import { trackAnalyticsEvent } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";
import type { Seller } from "@/types/Seller";
import {
  buildInstagramUrl,
  formatInstagramHandle,
} from "@/utils/instagram";
import {
  buildStoreWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/utils/whatsapp";

type SellerCardProps = {
  seller: Seller;
  className?: string;
};

function SellerCard({ seller, className }: SellerCardProps) {
  const { name, city, advertisementCount, avatarUrl, slug, whatsApp, instagram } =
    seller;
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

  return (
    <Card
      size="sm"
      className={cn("card-interactive h-full rounded-2xl", className)}
    >
      <CardContent className="flex flex-col gap-3 py-0.5">
        <Link
          href={storePath(slug)}
          className="focus-visible:ring-ring flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label={`Ver loja ${name}`}
        >
          <div className="bg-store/15 text-store flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- avatar remoto da loja
              <img src={avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              <Store className="size-5" aria-hidden />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold">{name}</h3>
            <p className="text-small flex items-center gap-1 text-xs">
              <MapPin className="text-location size-3 shrink-0" aria-hidden />
              {city}
            </p>
            <Badge variant="secondary" className="mt-1">
              {adsLabel}
            </Badge>
          </div>
        </Link>

        {contactHref || instagramHref ? (
          <div className="flex flex-col gap-2">
            {contactHref ? (
              <a
                href={contactHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "whatsapp", size: "sm" }),
                  "w-full justify-center",
                )}
                aria-label={`Abrir WhatsApp de ${name}`}
                onClick={() => {
                  if (slug) {
                    trackAnalyticsEvent({
                      eventType: AnalyticsEventType.StoreWhatsappClicked,
                      storeSlug: slug,
                    });
                  }
                }}
              >
                <MessageCircle aria-hidden className="size-4" />
                Entrar em contato
              </a>
            ) : null}
            {instagramHref && instagramLabel ? (
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "instagram", size: "sm" }),
                  "w-full justify-center",
                )}
                aria-label={`Abrir Instagram de ${name}`}
              >
                <InstagramIcon className="size-4" />
                {instagramLabel}
              </a>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { SellerCard };
export type { SellerCardProps };
