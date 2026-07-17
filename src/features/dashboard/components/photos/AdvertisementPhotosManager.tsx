"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PhotoDropzone } from "@/features/dashboard/components/photos/PhotoDropzone";
import { PhotoGrid } from "@/features/dashboard/components/photos/PhotoGrid";
import { usePhotoUploadQueue } from "@/features/dashboard/components/photos/usePhotoUploadQueue";
import type { AdvertisementPhotoDto } from "@/contracts/advertisements/responses";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { advertisementService } from "@/services/advertisement.service";
import { cn } from "@/lib/utils";

type AdvertisementPhotosManagerProps = {
  advertisementId: string;
  photos: AdvertisementPhotoDto[];
  maxPhotos: number;
  usedCount: number;
  remaining: number;
  maxFileSizeMB: number;
  onChanged: () => void;
  disabled?: boolean;
  loading?: boolean;
  errorMessage?: string | null;
};

function AdvertisementPhotosManager({
  advertisementId,
  photos,
  maxPhotos,
  usedCount,
  remaining,
  maxFileSizeMB,
  onChanged,
  disabled = false,
  loading = false,
  errorMessage = null,
}: AdvertisementPhotosManagerProps) {
  const [localPhotos, setLocalPhotos] = useState(photos);
  const [busyPhotoId, setBusyPhotoId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    setLocalPhotos(
      [...photos].sort((a, b) => a.displayOrder - b.displayOrder),
    );
  }, [photos]);

  const handleUploadCompleted = useCallback(
    (photo: AdvertisementPhotoDto) => {
      setLocalPhotos((current) => {
        const next = [...current, photo].sort(
          (a, b) => a.displayOrder - b.displayOrder,
        );
        return next;
      });
      onChanged();
    },
    [onChanged],
  );

  const queue = usePhotoUploadQueue({
    advertisementId,
    maxPhotos,
    usedCount: localPhotos.length,
    maxFileSizeMB,
    onUploadCompleted: handleUploadCompleted,
  });

  const effectiveRemaining = useMemo(() => {
    const pending = queue.items.filter(
      (item) => item.status === "queued" || item.status === "uploading",
    ).length;
    return Math.max(0, maxPhotos - localPhotos.length - pending);
  }, [localPhotos.length, maxPhotos, queue.items]);

  const handleFilesSelected = (files: FileList | File[]) => {
    const rejections = queue.enqueueFiles(files);
    for (const message of rejections) {
      toast.error(message);
    }
  };

  const handleReorder = async (nextPhotos: AdvertisementPhotoDto[]) => {
    const previous = localPhotos;
    setLocalPhotos(nextPhotos);
    setReordering(true);
    try {
      await advertisementService.updatePhotoOrder(advertisementId, {
        photoIds: nextPhotos.map((photo) => photo.id),
      });
      onChanged();
    } catch (error) {
      setLocalPhotos(previous);
      toast.error(getFriendlyErrorMessage(error));
    } finally {
      setReordering(false);
    }
  };

  const handleSetPrimary = async (photoId: string) => {
    if (disabled || busyPhotoId) return;
    setBusyPhotoId(photoId);
    try {
      await advertisementService.setPrimaryPhoto(advertisementId, photoId);
      setLocalPhotos((current) =>
        current.map((photo) => ({
          ...photo,
          isPrimary: photo.id === photoId,
        })),
      );
      onChanged();
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error));
    } finally {
      setBusyPhotoId(null);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (disabled || busyPhotoId) return;
    setBusyPhotoId(photoId);
    try {
      await advertisementService.deletePhoto(advertisementId, photoId);
      setLocalPhotos((current) => current.filter((photo) => photo.id !== photoId));
      onChanged();
      toast.success("Foto removida.");
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error));
    } finally {
      setBusyPhotoId(null);
    }
  };

  return (
    <section
      className={cn(
        "bg-muted/30 border-border flex flex-col gap-4 rounded-xl border p-4 sm:p-5",
        (loading || reordering) && "opacity-95",
      )}
      aria-busy={loading || queue.isUploading || reordering}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-foreground text-sm font-semibold">Fotos</h2>
          <p className="text-muted-foreground text-xs">
            Arraste para reordenar · clique na estrela para definir a principal ·
            envie várias imagens de uma vez.
          </p>
        </div>
        <p className="text-muted-foreground text-xs tabular-nums">
          {localPhotos.length}/{maxPhotos} · {remaining} restantes
        </p>
      </div>

      {errorMessage ? (
        <p className="text-destructive text-sm" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {loading ? (
        <p className="text-muted-foreground text-sm" role="status">
          Carregando fotos…
        </p>
      ) : (
        <>
          <PhotoDropzone
            disabled={disabled || reordering}
            remaining={effectiveRemaining}
            maxPhotos={maxPhotos}
            usedCount={localPhotos.length}
            maxFileSizeMB={maxFileSizeMB}
            onFilesSelected={handleFilesSelected}
          />

          <PhotoGrid
            photos={localPhotos}
            queueItems={queue.items}
            disabled={disabled || reordering}
            busyPhotoId={busyPhotoId}
            onReorder={handleReorder}
            onSetPrimary={handleSetPrimary}
            onDelete={handleDelete}
            onCancelUpload={queue.cancelItem}
            onRemoveUpload={queue.removeItem}
          />
        </>
      )}
    </section>
  );
}

export { AdvertisementPhotosManager };
