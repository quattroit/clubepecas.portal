import Link from "next/link";
import { Store } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { storePath } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Seller } from "@/types/Seller";

type SellerCardProps = {
  seller: Seller;
  className?: string;
};

function SellerCard({ seller, className }: SellerCardProps) {
  const { name, city, advertisementCount, avatarUrl, slug } = seller;
  const adsLabel =
    advertisementCount === 1 ? "1 anúncio" : `${advertisementCount} anúncios`;

  return (
    <Link
      href={storePath(slug)}
      className={cn(
        "focus-visible:ring-ring block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
      )}
      aria-label={`Ver loja ${name}`}
    >
      <Card
        size="sm"
        className="h-full shadow-xs transition-shadow hover:shadow-sm"
      >
        <CardContent className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- avatar mockado
              <img src={avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              <Store className="size-6" aria-hidden />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-h3 truncate">{name}</h3>
            <p className="text-small">{city}</p>
            <p className="text-small text-muted-foreground">{adsLabel}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export { SellerCard };
export type { SellerCardProps };
