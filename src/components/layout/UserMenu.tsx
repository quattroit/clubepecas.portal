"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Home, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/providers/AuthProvider";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

function UserMenu() {
  const { user, logout, isLoggingOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.replace(ROUTES.HOME);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menu do usuário"
        onClick={() => setOpen((current) => !current)}
        className="hover:bg-muted focus-visible:ring-ring inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none focus-visible:ring-2"
      >
        <span className="bg-secondary text-secondary-foreground flex size-8 items-center justify-center rounded-full">
          <UserRound className="size-4" aria-hidden />
        </span>
        <span className="hidden max-w-[9rem] truncate font-medium sm:inline">
          {user.fullName}
        </span>
        <ChevronDown className="size-4 opacity-70" aria-hidden />
      </button>

      {open ? (
        <div
          role="menu"
          className="border-border bg-popover text-popover-foreground absolute right-0 z-50 mt-2 w-52 rounded-lg border p-1 shadow-md"
        >
          <p className="text-muted-foreground truncate px-3 py-2 text-xs">
            {user.email}
          </p>
          <Link
            href={ROUTES.HOME}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="hover:bg-muted focus-visible:ring-ring flex items-center gap-2 rounded-md px-3 py-2 text-sm outline-none focus-visible:ring-2"
          >
            <Home className="size-4 opacity-70" aria-hidden />
            Voltar ao site
          </Link>
          <Link
            href={ROUTES.MY_ADVERTISEMENTS}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="hover:bg-muted focus-visible:ring-ring block rounded-md px-3 py-2 text-sm outline-none focus-visible:ring-2"
          >
            Meus anúncios
          </Link>
          <Link
            href={ROUTES.PROFILE}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="hover:bg-muted focus-visible:ring-ring block rounded-md px-3 py-2 text-sm outline-none focus-visible:ring-2"
          >
            Meu perfil
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start gap-2 px-3",
            )}
          >
            <LogOut className="size-4" aria-hidden />
            {isLoggingOut ? "Saindo…" : "Sair"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export { UserMenu };
