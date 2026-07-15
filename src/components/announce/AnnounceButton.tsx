"use client";

import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { useAnnounceFlow } from "@/hooks/useAnnounceFlow";
import { cn } from "@/lib/utils";

type AnnounceButtonProps = Omit<
  ComponentProps<typeof Button>,
  "onClick" | "type"
> & {
  onNavigate?: () => void;
};

/**
 * CTA "Anunciar Peça" — delega a decisão de rota a useAnnounceFlow.
 */
function AnnounceButton({
  children = "Anunciar Peça",
  className,
  disabled,
  onNavigate,
  ...props
}: AnnounceButtonProps) {
  const { goToAnnounce, isPending } = useAnnounceFlow();

  return (
    <Button
      type="button"
      className={cn(className)}
      disabled={disabled || isPending}
      onClick={() => {
        onNavigate?.();
        void goToAnnounce();
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

export { AnnounceButton };
