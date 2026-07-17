"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Package, Pencil, Trash2 } from "lucide-react";

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

function statusBadgeVariant(
  label?: string,
): "success" | "warning" | "secondary" | "outline" {
  switch (label) {
    case "Publicado":
      return "success";
    case "Pausado":
      return "warning";
    case "Vendido":
      return "secondary";
    case "Arquivado":
    default:
      return "outline";
  }
}

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
    stockQuantity,
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
      className={cn(
        "card-interactive h-full gap-0 overflow-hidden rounded-xl py-0",
        className,
      )}
    >
      <div className="bg-muted relative aspect-[5/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Foto do anúncio: ${title}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover/card:scale-[1.03]"
          />
        ) : (
          <div
            className="text-muted-foreground flex size-full items-center justify-center"
            role="img"
            aria-label={`Sem foto para o anúncio: ${title}`}
          >
            <Package className="size-6" aria-hidden />
          </div>
        )}

        <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1">
          {statusLabel ? (
            <Badge
              variant={statusBadgeVariant(statusLabel)}
              className="px-1.5 py-0 text-[10px]"
            >
              {statusLabel}
            </Badge>
          ) : null}
          {isNew ? (
            <Badge variant="success" className="px-1.5 py-0 text-[10px]">
              Novo
            </Badge>
          ) : null}
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-0.5 px-2.5 py-2">
        <p className="text-category truncate text-[10px] font-medium">
          {category}
        </p>
        <h3 className="line-clamp-2 text-xs leading-snug font-semibold">
          {title}
        </h3>
        <p className="text-price text-sm">{formatCurrency(price)}</p>
        {typeof stockQuantity === "number" ? (
          <p className="text-muted-foreground text-[10px]">
            Estoque: {stockQuantity}{" "}
            {stockQuantity === 1 ? "unidade" : "unidades"}
          </p>
        ) : null}
        {location ? (
          <p className="text-muted-foreground flex items-center gap-0.5 text-[10px]">
            <MapPin className="text-location size-2.5 shrink-0" aria-hidden />
            <span className="truncate">{location}</span>
          </p>
        ) : null}
        {updatedAt ? (
          <p className="text-muted-foreground text-[10px]">
            Atualizado em {formatDate(updatedAt)}
          </p>
        ) : null}

        <div className="mt-auto flex gap-1.5 pt-1.5">
          <Link
            href={editAdvertisementPath(id)}
            className={cn(
              buttonVariants({ variant: "outline", size: "xs" }),
              "h-7 flex-1 gap-1 px-2 text-[11px]",
            )}
          >
            <Pencil className="size-3" aria-hidden />
            Editar
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 flex-1 gap-1 px-2 text-[11px]"
            disabled={isDeleting}
            aria-busy={isDeleting}
            onClick={() => onDeleteClick?.(advertisement)}
          >
            <Trash2 className="size-3" aria-hidden />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { MyAdvertisementCard };
export type { MyAdvertisementCardProps };
