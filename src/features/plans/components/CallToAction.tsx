"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { usePlanCtaHref } from "@/features/plans/hooks/usePlanCtaHref";
import { cn } from "@/lib/utils";

type CallToActionProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  className?: string;
};

function CallToAction({
  title = "Pronto para anunciar suas peças?",
  description = "Escolha um plano e comece a vender para milhares de compradores.",
  buttonLabel = "Começar Agora",
  className,
}: CallToActionProps) {
  const ctaHref = usePlanCtaHref();

  return (
    <section
      aria-labelledby="plans-final-cta-heading"
      className={cn(
        "surface-brand flex flex-col items-start gap-6 rounded-3xl px-6 py-10 sm:px-10 sm:py-12 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="flex max-w-xl flex-col gap-3">
        <h2 id="plans-final-cta-heading" className="text-h2 text-brand-foreground">
          {title}
        </h2>
        <p className="text-body text-brand-muted">{description}</p>
      </div>
      <Link
        href={ctaHref}
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "shrink-0")}
      >
        {buttonLabel}
      </Link>
    </section>
  );
}

export { CallToAction };
export type { CallToActionProps };
