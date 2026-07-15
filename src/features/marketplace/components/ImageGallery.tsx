"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ImageGalleryProps = {
  images: string[];
  alt: string;
  className?: string;
};

/**
 * Galeria simples — troca a imagem principal ao clicar na miniatura.
 */
function ImageGallery({ images, alt, className }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasImages = images.length > 0;
  const activeImage = hasImages ? images[activeIndex] : null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="bg-muted ring-foreground/10 relative aspect-[4/3] overflow-hidden rounded-xl ring-1">
        {activeImage ? (
          <Image
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
          {images.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <li key={`${image}-${index}`}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Ver foto ${index + 1}`}
                  aria-pressed={isActive}
                  className={cn(
                    "bg-muted ring-foreground/10 relative aspect-[4/3] w-full overflow-hidden rounded-lg ring-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                    isActive && "ring-2 ring-[var(--primary)]",
                  )}
                >
                  <Image
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
