"use client";

import { cn } from "@/lib/utils";

type PhotoPreviewProps = {
  src: string;
  alt?: string;
  className?: string;
};

function PhotoPreview({ src, alt = "", className }: PhotoPreviewProps) {
  return (
    <div
      className={cn(
        "bg-muted relative aspect-square size-full overflow-hidden",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
        draggable={false}
      />
    </div>
  );
}

export { PhotoPreview };
