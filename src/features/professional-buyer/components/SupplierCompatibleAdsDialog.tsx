"use client";

import Link from "next/link";
import { ExternalLink, Package } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { PageLoader } from "@/components/feedback/PageLoader";
import { RemoteImage } from "@/components/media/RemoteImage";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { advertisementPath } from "@/constants/routes";
import { usePartRequestSupplierAdvertisements } from "@/hooks/api/usePartRequestSupplierAdvertisements";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { resolveMediaUrl } from "@/lib/photo-url";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";

type SupplierCompatibleAdsDialogProps = {
  open: boolean;
  partRequestId: number;
  sellerId: number | null;
  storeName?: string;
  onOpenChange: (open: boolean) => void;
};

function SupplierCompatibleAdsDialog({
  open,
  partRequestId,
  sellerId,
  storeName,
  onOpenChange,
}: SupplierCompatibleAdsDialogProps) {
  const adsQuery = usePartRequestSupplierAdvertisements(
    partRequestId,
    sellerId ?? 0,
    open && Boolean(sellerId),
  );

  const title = storeName?.trim()
    ? `Peças de ${storeName}`
    : "Peças compatíveis";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-border shrink-0 border-b px-5 py-4 text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Confira os anúncios compatíveis deste fornecedor antes de entrar em
            contato.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {adsQuery.isLoading ? (
            <PageLoader label="Carregando anúncios…" />
          ) : null}

          {adsQuery.isError ? (
            <ErrorMessage
              title="Não foi possível carregar os anúncios"
              message={getFriendlyErrorMessage(adsQuery.error)}
            />
          ) : null}

          {adsQuery.data && adsQuery.data.items.length === 0 ? (
            <EmptyState
              title="Nenhum anúncio compatível"
              description="Este fornecedor não possui anúncios publicados compatíveis no momento."
              icon={<Package aria-hidden />}
            />
          ) : null}

          {adsQuery.data && adsQuery.data.items.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {adsQuery.data.items.map((item) => {
                const thumb = resolveMediaUrl(item.thumbnailUrl);
                return (
                  <li
                    key={item.id}
                    className="border-border flex items-center gap-3 rounded-xl border p-3"
                  >
                    <div className="bg-muted relative size-14 shrink-0 overflow-hidden rounded-lg">
                      {thumb ? (
                        <RemoteImage
                          src={thumb}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-muted-foreground flex size-full items-center justify-center">
                          <Package className="size-5" aria-hidden />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground line-clamp-2 text-sm font-medium">
                        {item.title}
                      </p>
                      <p className="text-foreground mt-0.5 text-sm font-semibold tabular-nums">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <Link
                      href={advertisementPath(item.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "shrink-0",
                      )}
                    >
                      <ExternalLink className="size-3.5" aria-hidden />
                      Ver anúncio
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { SupplierCompatibleAdsDialog };
