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

function PhotoDropzone({
  disabled = false,
  remaining,
  maxPhotos,
  usedCount,
  maxFileSizeMB,
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
      aria-label="Área para adicionar fotos. Clique ou arraste imagens."
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
        "border-border bg-background focus-visible:ring-ring/50 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-8 text-center transition-colors outline-none focus-visible:ring-3",
        dragging && !isDisabled && "border-primary bg-primary/5",
        isDisabled
          ? "cursor-not-allowed opacity-60"
          : "hover:border-primary/50 hover:bg-muted/40 cursor-pointer",
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

      <span className="bg-muted text-foreground flex size-11 items-center justify-center rounded-full">
        <ImagePlus className="size-5" aria-hidden />
      </span>

      <div className="flex flex-col gap-1">
        <p className="text-foreground text-sm font-medium">
          {remaining <= 0
            ? "Limite de fotos atingido"
            : "Arraste imagens ou clique para selecionar"}
        </p>
        <p className="text-muted-foreground text-xs">
          JPG, PNG ou WEBP · até {maxFileSizeMB} MB cada · {usedCount}/
          {maxPhotos} usadas · {remaining} restantes
        </p>
      </div>
    </div>
  );
}

export { PhotoDropzone };
