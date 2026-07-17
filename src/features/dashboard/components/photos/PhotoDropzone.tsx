"use client";

import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

import { PHOTO_ACCEPT } from "@/features/dashboard/components/photos/photoValidation";
import { cn } from "@/lib/utils";

type PhotoDropzoneProps = {
  disabled?: boolean;
  remaining: number;
  maxPhotos: number;
  usedCount: number;
  maxFileSizeMB: number;
  onFilesSelected: (files: FileList | File[]) => void;
};

/**
 * Tile quadrado de upload — sempre no tamanho da grade de fotos.
 */
function PhotoDropzone({
  disabled = false,
  remaining,
  maxPhotos,
  usedCount,
  onFilesSelected,
}: PhotoDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const isDisabled = disabled || remaining <= 0;

  const openPicker = () => {
    if (isDisabled) return;
    inputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (isDisabled) return;
    if (event.dataTransfer.files?.length) {
      onFilesSelected(event.dataTransfer.files);
    }
  };

  return (
    <div
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
      aria-label="Adicionar fotos. Clique ou arraste imagens."
      onClick={openPicker}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPicker();
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!isDisabled) setDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!isDisabled) setDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragging(false);
      }}
      onDrop={handleDrop}
      className={cn(
        "focus-visible:ring-ring/50 flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-2 text-center outline-none transition-all focus-visible:ring-3",
        dragging && !isDisabled
          ? "border-primary bg-primary/10"
          : "border-primary/40 bg-primary/[0.04]",
        isDisabled
          ? "cursor-not-allowed opacity-55"
          : "hover:border-primary hover:bg-primary/[0.08] cursor-pointer",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={PHOTO_ACCEPT}
        multiple
        className="sr-only"
        disabled={isDisabled}
        onChange={(event) => {
          if (event.target.files?.length) {
            onFilesSelected(event.target.files);
          }
          event.target.value = "";
        }}
      />

      <span className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-full shadow-sm">
        <ImagePlus className="size-4" aria-hidden />
      </span>

      <div className="flex flex-col gap-0.5">
        <p className="text-foreground text-xs leading-tight font-semibold">
          {remaining <= 0 ? "Limite" : "Adicionar"}
        </p>
        <p className="text-muted-foreground text-[11px] leading-tight tabular-nums">
          {usedCount}/{maxPhotos}
        </p>
      </div>
    </div>
  );
}

export { PhotoDropzone };
