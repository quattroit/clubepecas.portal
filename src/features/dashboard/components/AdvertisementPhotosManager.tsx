"use client";

import { useRef, useState } from "react";
import { Loader2, Star, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { AdvertisementPhotoDto } from "@/contracts/advertisements/responses";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { resolvePhotoPublicUrl } from "@/lib/photo-url";
import { advertisementService } from "@/services/advertisement.service";

const ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

type AdvertisementPhotosManagerProps = {
  advertisementId: string;
  photos: AdvertisementPhotoDto[];
  onChanged: () => void;
  disabled?: boolean;
};

function AdvertisementPhotosManager({
  advertisementId,
  photos,
  onChanged,
  disabled = false,
}: AdvertisementPhotosManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [busyPhotoId, setBusyPhotoId] = useState<string | null>(null);

  const sorted = [...photos].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return a.displayOrder - b.displayOrder;
  });

  const handlePick = () => {
    if (disabled || uploading) return;
    inputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      await advertisementService.uploadPhoto(advertisementId, file);
      toast.success("Foto enviada com sucesso!");
      onChanged();
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (disabled || busyPhotoId) return;
    setBusyPhotoId(photoId);
    try {
      await advertisementService.deletePhoto(advertisementId, photoId);
      toast.success("Foto removida.");
      onChanged();
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error));
    } finally {
      setBusyPhotoId(null);
    }
  };

  const handleSetPrimary = async (photoId: string) => {
    if (disabled || busyPhotoId) return;
    setBusyPhotoId(photoId);
    try {
      await advertisementService.setPrimaryPhoto(advertisementId, photoId);
      toast.success("Foto principal definida.");
      onChanged();
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error));
    } finally {
      setBusyPhotoId(null);
    }
  };

  return (
    <section className="bg-muted/30 border-border flex flex-col gap-4 rounded-xl border p-4 sm:p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-foreground text-sm font-semibold">Fotos</h2>
        <p className="text-muted-foreground text-xs">
          Envie imagens JPG, PNG ou WEBP (até 10 MB). Após o envio, a prévia
          aparece imediatamente.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      <div>
        <Button
          type="button"
          variant="outline"
          onClick={handlePick}
          disabled={disabled || uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Enviando…
            </>
          ) : (
            <>
              <Upload className="size-4" aria-hidden />
              Selecionar arquivo
            </>
          )}
        </Button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhuma foto cadastrada ainda.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((photo) => {
            const src = resolvePhotoPublicUrl(photo);
            const busy = busyPhotoId === photo.id;

            return (
              <li
                key={photo.id}
                className="border-border bg-background flex flex-col gap-3 overflow-hidden rounded-xl border"
              >
                <div className="bg-muted relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="size-full object-cover"
                  />
                  {photo.isPrimary ? (
                    <span className="bg-foreground/80 text-background absolute top-2 left-2 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                      Principal
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2 px-3 pb-3">
                  {!photo.isPrimary ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={disabled || busy}
                      onClick={() => handleSetPrimary(photo.id)}
                    >
                      {busy ? (
                        <Loader2 className="size-3.5 animate-spin" aria-hidden />
                      ) : (
                        <Star className="size-3.5" aria-hidden />
                      )}
                      Principal
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disabled || busy}
                    onClick={() => handleDelete(photo.id)}
                  >
                    {busy ? (
                      <Loader2 className="size-3.5 animate-spin" aria-hidden />
                    ) : (
                      <Trash2 className="size-3.5" aria-hidden />
                    )}
                    Excluir
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export { AdvertisementPhotosManager };
