"use client";

import { Loader2, Star, Trash2, X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { PhotoPreview } from "@/features/dashboard/components/photos/PhotoPreview";
import type { UploadQueueItem } from "@/features/dashboard/components/photos/usePhotoUploadQueue";
import type { AdvertisementPhotoDto } from "@/contracts/advertisements/responses";
import { cn } from "@/lib/utils";

type SavedPhotoCardProps = {
  photo: AdvertisementPhotoDto;
  disabled?: boolean;
  busy?: boolean;
  onSetPrimary: (photoId: string) => void;
  onDelete: (photoId: string) => void;
};

function SavedPhotoCard({
  photo,
  disabled = false,
  busy = false,
  onSetPrimary,
  onDelete,
}: SavedPhotoCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-border bg-background group relative flex flex-col overflow-hidden rounded-xl border transition-shadow",
        isDragging && "z-10 shadow-lg ring-2 ring-primary/30",
        photo.isPrimary && "ring-primary/40 ring-2",
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-left active:cursor-grabbing"
        aria-label={`Arrastar foto${photo.isPrimary ? " principal" : ""}`}
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <PhotoPreview src={photo.publicUrl} alt="" />
      </button>

      {photo.isPrimary ? (
        <span className="bg-foreground/85 text-background absolute top-2 left-2 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
          Principal
        </span>
      ) : null}

      <div className="absolute top-2 right-2 flex gap-1">
        <Button
          type="button"
          size="icon-xs"
          variant={photo.isPrimary ? "primary" : "outline"}
          className="bg-background/90 backdrop-blur-sm"
          disabled={disabled || busy || photo.isPrimary}
          aria-label={
            photo.isPrimary ? "Foto principal" : "Definir como principal"
          }
          onClick={() => onSetPrimary(photo.id)}
        >
          {busy ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <Star
              className={cn(
                "size-3.5",
                photo.isPrimary && "fill-current",
              )}
              aria-hidden
            />
          )}
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="outline"
          className="bg-background/90 backdrop-blur-sm"
          disabled={disabled || busy}
          aria-label="Excluir foto"
          onClick={() => onDelete(photo.id)}
        >
          {busy ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <Trash2 className="size-3.5" aria-hidden />
          )}
        </Button>
      </div>
    </li>
  );
}

type QueuePhotoCardProps = {
  item: UploadQueueItem;
  onCancel: (localId: string) => void;
  onRemove: (localId: string) => void;
};

function statusLabel(item: UploadQueueItem): string {
  switch (item.status) {
    case "queued":
      return "Na fila";
    case "uploading":
      return "Enviando";
    case "done":
      return "Concluído";
    case "error":
      return "Erro";
    case "cancelled":
      return "Cancelado";
    default:
      return "";
  }
}

function QueuePhotoCard({ item, onCancel, onRemove }: QueuePhotoCardProps) {
  const canCancel =
    item.status === "queued" || item.status === "uploading";
  const canRemove =
    item.status === "error" || item.status === "cancelled";

  return (
    <li className="border-border bg-background flex flex-col overflow-hidden rounded-xl border">
      <div className="relative">
        <PhotoPreview src={item.previewUrl} alt={item.file.name} />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          {(item.status === "queued" || item.status === "uploading") && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2 text-[11px] text-white/90">
                <span>{statusLabel(item)}</span>
                <span className="tabular-nums">
                  {Math.round(item.progress)}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/25">
                <div
                  className="h-full rounded-full bg-white transition-[width] duration-200"
                  style={{
                    width: `${Math.max(0, Math.min(100, item.progress))}%`,
                  }}
                />
              </div>
            </div>
          )}
          {(item.status === "error" || item.status === "cancelled") && (
            <p className="text-xs text-white" role="alert">
              {item.errorMessage ?? statusLabel(item)}
            </p>
          )}
        </div>
        {canCancel || canRemove ? (
          <Button
            type="button"
            size="icon-xs"
            variant="outline"
            className="bg-background/90 absolute top-2 right-2 backdrop-blur-sm"
            aria-label={canCancel ? "Cancelar envio" : "Remover"}
            onClick={() =>
              canCancel ? onCancel(item.localId) : onRemove(item.localId)
            }
          >
            <X className="size-3.5" aria-hidden />
          </Button>
        ) : null}
      </div>
      <p className="text-muted-foreground truncate px-3 py-2 text-xs">
        {item.file.name}
      </p>
    </li>
  );
}

export { SavedPhotoCard, QueuePhotoCard };
