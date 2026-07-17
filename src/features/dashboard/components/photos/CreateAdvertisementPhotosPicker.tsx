"use client";

import { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PhotoDropzone } from "@/features/dashboard/components/photos/PhotoDropzone";
import { PhotoPreview } from "@/features/dashboard/components/photos/PhotoPreview";
import {
  photoGalleryGridClassName,
  photoGallerySectionClassName,
} from "@/features/dashboard/components/photos/photoGalleryLayout";
import {
  fileFingerprint,
  validatePhotoFile,
} from "@/features/dashboard/components/photos/photoValidation";

export type PendingPhoto = {
  localId: string;
  file: File;
  previewUrl: string;
  fingerprint: string;
};

type CreateAdvertisementPhotosPickerProps = {
  maxPhotos?: number;
  maxFileSizeMB?: number;
  disabled?: boolean;
  value: PendingPhoto[];
  onChange: (photos: PendingPhoto[]) => void;
};

function CreateAdvertisementPhotosPicker({
  maxPhotos = 3,
  maxFileSizeMB = 10,
  disabled = false,
  value,
  onChange,
}: CreateAdvertisementPhotosPickerProps) {
  const remaining = Math.max(0, maxPhotos - value.length);

  useEffect(() => {
    return () => {
      for (const photo of value) {
        URL.revokeObjectURL(photo.previewUrl);
      }
    };
    // Revoke only on unmount; intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilesSelected = (files: FileList | File[]) => {
    const list = Array.from(files);
    const existing = new Set(value.map((photo) => photo.fingerprint));
    const next = [...value];
    const rejections: string[] = [];
    let slots = maxPhotos - next.length;

    for (const file of list) {
      const fingerprint = fileFingerprint(file);
      if (existing.has(fingerprint)) {
        rejections.push(`"${file.name}": arquivo já selecionado.`);
        continue;
      }

      const validation = validatePhotoFile(file, maxFileSizeMB);
      if (!validation.ok) {
        rejections.push(validation.message);
        continue;
      }

      if (slots <= 0) {
        rejections.push(
          `Limite de ${maxPhotos} fotos atingido. "${file.name}" não foi adicionado.`,
        );
        continue;
      }

      existing.add(fingerprint);
      slots -= 1;
      next.push({
        localId: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        fingerprint,
      });
    }

    for (const message of rejections) {
      toast.error(message);
    }

    if (next.length !== value.length) {
      onChange(next);
    }
  };

  const removePhoto = (localId: string) => {
    const target = value.find((photo) => photo.localId === localId);
    if (target) URL.revokeObjectURL(target.previewUrl);
    onChange(value.filter((photo) => photo.localId !== localId));
  };

  const usedCount = value.length;
  const emptySlots = Math.max(0, maxPhotos - usedCount - (remaining > 0 ? 1 : 0));

  const counterLabel = useMemo(
    () => `${usedCount}/${maxPhotos}`,
    [maxPhotos, usedCount],
  );

  return (
    <section className={photoGallerySectionClassName}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex flex-col gap-0.5">
          <h2 className="text-foreground text-sm font-semibold">Fotos</h2>
          <p className="text-muted-foreground text-[11px] leading-snug">
            Opcional · ao publicar
          </p>
        </div>
        <span className="bg-primary/10 text-primary shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums">
          {counterLabel}
        </span>
      </div>

      <ul className={photoGalleryGridClassName}>
        {value.map((photo) => (
          <li
            key={photo.localId}
            className="border-border bg-background relative aspect-square overflow-hidden rounded-lg border"
          >
            <PhotoPreview
              src={photo.previewUrl}
              alt={photo.file.name}
              className="size-full"
            />
            <Button
              type="button"
              size="icon-xs"
              variant="outline"
              className="bg-background/95 absolute top-1.5 right-1.5 size-7 shadow-sm backdrop-blur-sm"
              disabled={disabled}
              aria-label={`Remover ${photo.file.name}`}
              onClick={() => removePhoto(photo.localId)}
            >
              <X className="size-3" aria-hidden />
            </Button>
          </li>
        ))}

        {remaining > 0 ? (
          <li>
            <PhotoDropzone
              disabled={disabled}
              remaining={remaining}
              maxPhotos={maxPhotos}
              usedCount={usedCount}
              maxFileSizeMB={maxFileSizeMB}
              onFilesSelected={handleFilesSelected}
            />
          </li>
        ) : null}

        {Array.from({ length: emptySlots }).map((_, index) => (
          <li
            key={`empty-${index}`}
            className="border-border/70 bg-muted/40 aspect-square rounded-lg border border-dashed"
            aria-hidden
          />
        ))}
      </ul>

      <p className="text-muted-foreground text-[11px]">
        JPG, PNG ou WEBP · até {maxFileSizeMB} MB cada
      </p>
    </section>
  );
}

export { CreateAdvertisementPhotosPicker };
