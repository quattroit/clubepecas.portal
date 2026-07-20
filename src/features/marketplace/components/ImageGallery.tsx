"use client";

import { Package } from "lucide-react";
import { useState } from "react";

import { RemoteImage } from "@/components/media/RemoteImage";
import { cn } from "@/lib/utils";

type ImageGalleryProps = {
  images: string[];
  /** Miniaturas para a faixa; se omitido, usa images. */
  thumbnails?: string[];
  alt: string;
  className?: string;
};

/**
 * Galeria simples — troca a imagem principal ao clicar na miniatura.
 */
function ImageGallery({ images, thumbnails, alt, className }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasImages = images.length > 0;
  const activeImage = hasImages ? images[activeIndex] : null;
  const strip = thumbnails?.length ? thumbnails : images;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="bg-muted ring-border relative aspect-[4/3] overflow-hidden rounded-xl shadow-xs ring-1">
        {activeImage ? (
          <RemoteImage
            src={activeImage}
            alt={`${alt} — foto ${activeIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="text-muted-foreground flex size-full items-center justify-center"
            role="img"
            aria-label={`Sem foto para: ${alt}`}
          >
            <Package className="size-12" aria-hidden />
          </div>
        )}
      </div>

      {hasImages && images.length > 1 ? (
        <ul
          className="grid grid-cols-4 gap-2 sm:grid-cols-5"
          aria-label="Miniaturas da galeria"
        >
          {strip.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <li key={`${image}-${index}`}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Ver foto ${index + 1}`}
                  aria-pressed={isActive}
                  className={cn(
                    "bg-muted relative aspect-[4/3] w-full overflow-hidden rounded-lg ring-1 outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "ring-primary ring-2 opacity-100"
                      : "ring-border opacity-80 hover:opacity-100 hover:ring-primary/40",
                  )}
                >
                  <RemoteImage
                    src={image}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export { ImageGallery };
export type { ImageGalleryProps };
