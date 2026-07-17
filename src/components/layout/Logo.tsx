import Image from "next/image";
import Link from "next/link";

import {
  APP_LOGO_HEIGHT,
  APP_LOGO_SRC,
  APP_LOGO_WIDTH,
  APP_NAME,
} from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

type LogoProps = {
  className?: string;
  href?: string;
  /** Altura visual da marca (sm header compacto, md padrão, lg auth). */
  size?: LogoSize;
  priority?: boolean;
  /**
   * Em superfícies brand (navy): a logo já tem fundo escuro —
   * não aplicar caixa clara.
   */
  onBrand?: boolean;
};

const sizeClassName: Record<LogoSize, string> = {
  sm: "h-8 w-auto",
  md: "h-10 w-auto",
  /** Escala com a viewport — adequada a login/cadastro. */
  lg: "h-auto w-[min(88vw,20rem)] object-center sm:w-[min(70vw,24rem)] md:w-[26rem]",
};

function Logo({
  className,
  href = ROUTES.HOME,
  size = "md",
  priority = false,
  onBrand = false,
}: LogoProps) {
  return (
    <Link
      href={href}
      aria-label={`${APP_NAME} — página inicial`}
      className={cn(
        "focus-visible:ring-ring inline-flex items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        onBrand && "rounded-lg",
        className,
      )}
    >
      <Image
        src={APP_LOGO_SRC}
        alt={APP_NAME}
        width={APP_LOGO_WIDTH}
        height={APP_LOGO_HEIGHT}
        priority={priority}
        className={cn(
          "object-contain object-left",
          sizeClassName[size],
          /* Em fundo claro (padrão), a logo escura se destaca naturalmente */
          !onBrand && "rounded-md",
        )}
      />
    </Link>
  );
}

export { Logo };
export type { LogoProps, LogoSize };
