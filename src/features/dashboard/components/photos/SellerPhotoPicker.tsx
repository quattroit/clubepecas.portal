"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { RemoteImage } from "@/components/media/RemoteImage";
import { Button } from "@/components/ui/button";
import { PhotoDropzone } from "@/features/dashboard/components/photos/PhotoDropzone";
import { PhotoPreview } from "@/features/dashboard/components/photos/PhotoPreview";
import { validatePhotoFile } from "@/features/dashboard/components/photos/photoValidation";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { queryKeys } from "@/lib/queryKeys";
import { resolveMediaUrl } from "@/lib/photo-url";
import { sellerService } from "@/services/seller.service";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE_MB = 10;

type SellerPhotoPickerProps = {
  /** Modo create: arquivo fica pendente até o perfil existir. Edit: upload imediato. */
  mode: "create" | "edit";
  value: string;
  onChange: (photoUrl: string) => void;
  pendingFile: File | null;
  onPendingFileChange: (file: File | null) => void;
  disabled?: boolean;
};

/**
 * Upload de 1 foto de perfil — mesma UX visual das fotos de anúncio.
 */
function SellerPhotoPicker({
  mode,
  value,
  onChange,
  pendingFile,
  onPendingFileChange,
  disabled = false,
}: SellerPhotoPickerProps) {
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  const displayUrl =
    previewUrl ||
    (pendingFile ? objectUrlRef.current : null) ||
    (value.trim() ? resolveMediaUrl(value) : null);

  const hasPhoto = Boolean(displayUrl);
  const busy = disabled || uploading || removing;

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!pendingFile) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setPreviewUrl(null);
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const url = URL.createObjectURL(pendingFile);
    objectUrlRef.current = url;
    setPreviewUrl(url);
  }, [pendingFile]);

  const handleFilesSelected = async (files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file || busy) return;

    const validation = validatePhotoFile(file, MAX_FILE_SIZE_MB);
    if (!validation.ok) {
      toast.error(validation.message);
      return;
    }

    if (mode === "create") {
      onPendingFileChange(file);
      onChange("");
      return;
    }

    setUploading(true);
    try {
      const result = await sellerService.uploadPhoto(file);
      onPendingFileChange(null);
      onChange(result.photoUrl);
      void queryClient.invalidateQueries({ queryKey: queryKeys.seller.me });
      toast.success("Foto atualizada.");
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (busy) return;

    if (mode === "create" || pendingFile) {
      onPendingFileChange(null);
      onChange("");
      return;
    }

    if (!value.trim()) {
      onChange("");
      return;
    }

    setRemoving(true);
    try {
      await sellerService.deletePhoto();
      onChange("");
      void queryClient.invalidateQueries({ queryKey: queryKeys.seller.me });
      toast.success("Foto removida.");
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error));
    } finally {
      setRemoving(false);
    }
  };

  return (
    <section
      className={cn(
        "border-border bg-card flex w-full max-w-2xl flex-col gap-2.5 rounded-xl border p-3 sm:p-4",
        busy && "opacity-95",
      )}
      aria-busy={busy}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex flex-col gap-0.5">
          <h2 className="text-foreground text-sm font-semibold">Foto do perfil</h2>
          <p className="text-muted-foreground text-[11px] leading-snug">
            Opcional · JPG, PNG ou WEBP · até {MAX_FILE_SIZE_MB} MB
          </p>
        </div>
        {(uploading || removing) && (
          <Loader2
            className="text-muted-foreground size-4 shrink-0 animate-spin"
            aria-hidden
          />
        )}
      </div>

      <div className="grid w-[7.5rem] grid-cols-1 gap-2.5 sm:w-32">
        {hasPhoto ? (
          <div className="border-border bg-background relative aspect-square overflow-hidden rounded-lg border">
            {displayUrl?.startsWith("blob:") ? (
              <PhotoPreview src={displayUrl} alt="Foto do perfil" className="size-full" />
            ) : displayUrl ? (
              <RemoteImage
                src={displayUrl}
                alt="Foto do perfil"
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : null}
            <Button
              type="button"
              size="icon-xs"
              variant="outline"
              className="bg-background/95 absolute top-1.5 right-1.5 size-7 shadow-sm backdrop-blur-sm"
              disabled={busy}
              aria-label="Remover foto"
              onClick={() => void handleRemove()}
            >
              <X className="size-3" aria-hidden />
            </Button>
          </div>
        ) : (
          <PhotoDropzone
            disabled={busy}
            remaining={1}
            maxPhotos={1}
            usedCount={0}
            maxFileSizeMB={MAX_FILE_SIZE_MB}
            onFilesSelected={(files) => {
              void handleFilesSelected(files);
            }}
          />
        )}
      </div>
    </section>
  );
}

export { SellerPhotoPicker };
