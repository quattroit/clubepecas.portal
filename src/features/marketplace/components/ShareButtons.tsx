import { Copy, MessageCircle, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ShareButtonsProps = {
  className?: string;
};

/**
 * Ações de compartilhamento — apenas visual nesta sprint.
 */
function ShareButtons({ className }: ShareButtonsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-small font-medium">Compartilhar</p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Copiar link"
        >
          <Copy className="size-4" />
          Copiar link
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Compartilhar no WhatsApp"
        >
          <MessageCircle className="size-4" />
          WhatsApp
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Compartilhar no Facebook"
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
