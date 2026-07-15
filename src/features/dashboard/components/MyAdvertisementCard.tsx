"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { editAdvertisementPath } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Advertisement } from "@/types/Advertisement";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

type MyAdvertisementCardProps = {
  advertisement: Advertisement;
  className?: string;
  onDeleteClick?: (advertisement: Advertisement) => void;
  isDeleting?: boolean;
};

/**
 * Variante interna do card de anúncio para o painel do proprietário.
 */
function MyAdvertisementCard({
  advertisement,
  className,
  onDeleteClick,
  isDeleting = false,
}: MyAdvertisementCardProps) {
  const {
    id,
    title,
    price,
    city,
    state,
    category,
    imageUrl,
    isNew,
    statusLabel,
    updatedAt,
  } = advertisement;

  const location = [city, state].filter(Boolean).join(", ");

  return (
    <Card
      size="sm"
      className={cn("h-full gap-0 py-0 shadow-xs", className)}
    >
      <div className="bg-muted relative aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Foto do anúncio: ${title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div
            className="text-muted-foreground flex size-full items-center justify-center"
            role="img"
            aria-label={`Sem foto para o anúncio: ${title}`}
          >
            <Package className="size-10" aria-hidden />
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {statusLabel ? (
            <Badge variant="outline">{statusLabel}</Badge>
          ) : null}
          {isNew ? <Badge variant="success">Novo</Badge> : null}
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-1.5 py-3">
        <p className="text-small text-muted-foreground truncate">{category}</p>
        <h3 className="text-h3 line-clamp-2 min-h-[2.7rem] leading-snug">
          {title}
        </h3>
        <p className="text-primary text-base font-semibold">
          {formatCurrency(price)}
        </p>
        {location ? (
          <p className="text-small text-muted-foreground">{location}</p>
        ) : (
          <p className="text-small text-muted-foreground">
            Cidade não informada
          </p>
        )}
        {updatedAt ? (
          <p className="text-small text-muted-foreground">
            Atualizado em {formatDate(updatedAt)}
          </p>
        ) : null}

        <div className="mt-auto flex gap-2 pt-2">
          <Link
            href={editAdvertisementPath(id)}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex-1",
            )}
          >
            <Pencil aria-hidden />
            Editar
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={isDeleting}
            onClick={() => onDeleteClick?.(advertisement)}
          >
            <Trash2 aria-hidden />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { MyAdvertisementCard };
export type { MyAdvertisementCardProps };
