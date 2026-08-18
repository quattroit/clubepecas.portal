"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { RemoteImage } from "@/components/media/RemoteImage";
import { Button } from "@/components/ui/button";
import {
  PHOTO_ACCEPT,
  validatePhotoFile,
} from "@/features/dashboard/components/photos/photoValidation";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { queryKeys } from "@/lib/queryKeys";
import { resolveMediaUrl } from "@/lib/photo-url";
import { sellerService } from "@/services/seller.service";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE_MB = 10;

type SellerCoverPickerProps = {
  /** Modo create: arquivo fica pendente até o perfil existir. Edit: upload imediato. */
  mode: "create" | "edit";
  value: string;
  onChange: (coverUrl: string) => void;
  pendingFile: File | null;
  onPendingFileChange: (file: File | null) => void;
  disabled?: boolean;
};

/**
 * Upload da imagem de capa do cabeçalho público da loja.
 */
function SellerCoverPicker({
  mode,
  value,
  onChange,
  pendingFile,
  onPendingFileChange,
  disabled = false,
}: SellerCoverPickerProps) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  const displayUrl =
    previewUrl ||
    (pendingFile ? objectUrlRef.current : null) ||
    (value.trim() ? resolveMediaUrl(value) : null);

  const hasCover = Boolean(displayUrl);
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

    onPendingFileChange(file);
    setUploading(true);
    try {
      const result = await sellerService.uploadCover(file);
      const nextUrl = result.coverUrl?.trim() ?? "";
      if (!nextUrl) {
        throw new Error("A API não retornou a URL da capa.");
      }
      onPendingFileChange(null);
      onChange(nextUrl);
      queryClient.setQueryData(queryKeys.seller.me, (current) => {
        if (!current || typeof current !== "object") return current;
        return { ...current, coverUrl: resolveMediaUrl(nextUrl) };
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.seller.me });
      toast.success("Capa atualizada.");
    } catch (error) {
      onPendingFileChange(null);
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
      await sellerService.deleteCover();
      onChange("");
      void queryClient.invalidateQueries({ queryKey: queryKeys.seller.me });
      toast.success("Capa removida.");
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error));
    } finally {
      setRemoving(false);
    }
  };

  const openPicker = () => {
    if (busy) return;
    inputRef.current?.click();
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
          <h2 className="text-foreground text-sm font-semibold">
            Capa da loja
          </h2>
          <p className="text-muted-foreground text-[11px] leading-snug">
            Opcional · aparece no fundo do cabeçalho público · JPG, PNG ou WEBP
            · até {MAX_FILE_SIZE_MB} MB
          </p>
        </div>
        {(uploading || removing) && (
          <Loader2
            className="text-muted-foreground size-4 shrink-0 animate-spin"
            aria-hidden
          />
        )}
      </div>

      {hasCover ? (
        <div className="border-border bg-muted relative h-36 w-full overflow-hidden rounded-lg border sm:h-44">
          {displayUrl?.startsWith("blob:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayUrl}
              alt="Capa da loja"
              className="absolute inset-0 size-full object-cover object-center"
              draggable={false}
            />
          ) : displayUrl ? (
            <RemoteImage
              src={displayUrl}
              alt="Capa da loja"
              fill
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-cover object-center"
            />
          ) : null}
          <Button
            type="button"
            size="icon-xs"
            variant="outline"
            className="bg-background/95 absolute top-1.5 right-1.5 size-7 shadow-sm backdrop-blur-sm"
            disabled={busy}
            aria-label="Remover capa"
            onClick={() => void handleRemove()}
          >
            <X className="size-3" aria-hidden />
          </Button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={busy ? -1 : 0}
          aria-disabled={busy}
          aria-label="Adicionar capa da loja. Clique ou arraste uma imagem."
          onClick={openPicker}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openPicker();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            if (!busy) setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!busy) setDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            if (busy) return;
            if (event.dataTransfer.files?.length) {
              void handleFilesSelected(event.dataTransfer.files);
            }
          }}
          className={cn(
            "focus-visible:ring-ring/50 flex h-36 w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-3 text-center outline-none transition-all focus-visible:ring-3 sm:h-44",
            dragging && !busy
              ? "border-primary bg-primary/10"
              : "border-primary/40 bg-primary/[0.04]",
            busy
              ? "cursor-not-allowed opacity-55"
              : "hover:border-primary hover:bg-primary/[0.08] cursor-pointer",
          )}
        >
          <span className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-full shadow-sm">
            <ImagePlus className="size-4" aria-hidden />
          </span>
          <p className="text-foreground text-xs leading-tight font-semibold">
            Adicionar capa
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={PHOTO_ACCEPT}
        className="sr-only"
        disabled={busy}
        onChange={(event) => {
          if (event.target.files?.length) {
            void handleFilesSelected(event.target.files);
          }
          event.target.value = "";
        }}
      />
    </section>
  );
}

export { SellerCoverPicker };
