"use client";

import { useState } from "react";
import { Copy, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constants/app";
import { advertisementPath } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { toAbsoluteUrl } from "@/utils/share";

type ShareButtonsProps = {
  /** Título do anúncio (mensagem de compartilhamento). */
  title: string;
  /** Slug público do anúncio. */
  slug: string;
  className?: string;
};

function buildWhatsAppShareUrl(url: string, title: string): string {
  const text = `Confira este anúncio no ${APP_NAME}: ${title}\n${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

function buildFacebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

/**
 * Ações de compartilhamento do anúncio (copiar link, WhatsApp, Facebook).
 */
function ShareButtons({ title, slug, className }: ShareButtonsProps) {
  const [isCopying, setIsCopying] = useState(false);

  function resolveUrl(): string {
    return toAbsoluteUrl(advertisementPath(slug));
  }

  async function handleCopyLink() {
    if (isCopying || !slug) return;

    setIsCopying(true);
    try {
      const url = resolveUrl();
      await navigator.clipboard.writeText(url);
      toast.success("Link do anúncio copiado");
    } catch {
      toast.error("Não foi possível copiar o link");
    } finally {
      setIsCopying(false);
    }
  }

  function handleWhatsApp() {
    if (!slug) return;
    const url = resolveUrl();
    window.open(
      buildWhatsAppShareUrl(url, title),
      "_blank",
      "noopener,noreferrer",
    );
  }

  function handleFacebook() {
    if (!slug) return;
    const url = resolveUrl();
    window.open(
      buildFacebookShareUrl(url),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <p className="text-small font-medium text-share">Compartilhar</p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Copiar link"
          className="text-share"
          disabled={isCopying || !slug}
          onClick={() => void handleCopyLink()}
        >
          <Copy className="size-4" />
          Copiar link
        </Button>
        <Button
          type="button"
          variant="whatsapp"
          size="sm"
          aria-label="Compartilhar no WhatsApp"
          disabled={!slug}
          onClick={handleWhatsApp}
        >
          <MessageCircle className="size-4" />
          WhatsApp
        </Button>
        <Button
          type="button"
          variant="facebook"
          size="sm"
          aria-label="Compartilhar no Facebook"
          disabled={!slug}
          onClick={handleFacebook}
        >
          <Share2 className="size-4" />
          Facebook
        </Button>
      </div>
    </div>
  );
}

export { ShareButtons };
export type { ShareButtonsProps };
