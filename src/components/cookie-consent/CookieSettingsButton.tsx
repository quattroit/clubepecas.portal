"use client";

import { openCookiePreferences } from "@/lib/cookie-consent";
import { cn } from "@/lib/utils";

type CookieSettingsButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

/**
 * Abre o diálogo de preferências de cookies (banner LGPD).
 */
function CookieSettingsButton({
  className,
  children = "Cookies",
}: CookieSettingsButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "text-small text-brand-muted hover:text-brand-foreground focus-visible:ring-primary rounded-md text-left transition-colors outline-none focus-visible:ring-2",
        className,
      )}
      onClick={() => openCookiePreferences()}
    >
      {children}
    </button>
  );
}

export { CookieSettingsButton };
