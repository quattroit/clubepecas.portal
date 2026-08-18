import type { ImgHTMLAttributes } from "react";

import { resolveMediaUrl } from "@/lib/photo-url";
import { cn } from "@/lib/utils";

type RemoteImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height"
> & {
  src: string;
  alt: string;
  /** Preenche o container relativo pai (equivalente ao `fill` do next/image). */
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

/**
 * Imagem remota (API / CDN / URLs de vendedores).
 * Usa `<img>` nativo para aceitar hosts arbitrários sem `remotePatterns`
 * e evitar falha do otimizador com HTTPS local.
 */
function RemoteImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  sizes,
  priority = false,
  ...props
}: RemoteImageProps) {
  const resolved = resolveMediaUrl(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      draggable={false}
      className={cn(fill && "absolute inset-0 size-full", className)}
      {...props}
    />
  );
}

export { RemoteImage };
